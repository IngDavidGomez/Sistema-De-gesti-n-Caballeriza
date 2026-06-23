package com.establo.service;

import com.establo.dto.ReportDto;
import com.establo.entity.*;
import com.establo.exception.BusinessException;
import com.establo.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.*;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly=true)
public class ReportService {
  private final HorseRepository horses;
  private final MedicalRecordRepository medical;
  private final InventoryItemRepository inventory;
  private final SupplyRecordRepository supplies;
  private final ReservationRepository reservations;
  private final EmployeeRepository employees;
  private final FeedingPlanRepository feedingPlans;

  public ReportDto.Overview overview(LocalDate from,LocalDate to){
    return overview(from,to,false);
  }

  public ReportDto.Overview overview(LocalDate from,LocalDate to,boolean includeAllHorses){
    LocalDate end=to==null?LocalDate.now():to;
    LocalDate start=from==null?end.minusDays(29):from;
    if(start.isAfter(end))throw new BusinessException("La fecha inicial no puede ser posterior a la final");
    if(start.plusYears(1).isBefore(end))throw new BusinessException("El período del reporte no puede superar un año");

    var startTime=start.atStartOfDay();
    var endTime=end.plusDays(1).atStartOfDay();
    var today=LocalDate.now();
    var activeHorses=horses.findAll().stream().filter(Horse::isActive).toList();
    var medicalList=medical.findAll();
    var periodMedical=medicalList.stream().filter(record->!record.getDate().isBefore(start)&&!record.getDate().isAfter(end)).toList();
    var allHealth=activeHorses.stream()
      .map(horse->healthRow(horse,medicalList,periodMedical,today))
      .sorted(Comparator.comparingInt((ReportDto.HealthRow row)->riskOrder(row.risk())).thenComparing(ReportDto.HealthRow::horse))
      .toList();
    var health=includeAllHorses?allHealth:allHealth.stream().filter(row->row.recordsInPeriod()>0).toList();

    var periodSupplies=supplies.findAll().stream().filter(record->!record.getDate().isBefore(startTime)&&record.getDate().isBefore(endTime)).toList();
    var inventoryRows=inventory.findAll().stream()
      .map(item->inventoryRow(item,periodSupplies))
      .sorted(Comparator.comparingInt((ReportDto.InventoryRow row)->"BAJO".equals(row.status())?0:1).thenComparing(ReportDto.InventoryRow::item))
      .toList();

    var reservationList=reservations.findAll().stream().filter(row->!row.getStartAt().isBefore(startTime)&&row.getStartAt().isBefore(endTime)).toList();
    var activities=reservationList.stream().collect(Collectors.groupingBy(Reservation::getActivityType)).entrySet().stream()
      .map(entry->activityRow(entry.getKey(),entry.getValue()))
      .sorted(Comparator.comparingLong(ReportDto.ActivityRow::reservations).reversed())
      .toList();
    var staff=employees.findAll().stream()
      .map(employee->staffRow(employee,reservationList))
      .sorted(Comparator.comparingLong(ReportDto.StaffRow::assignedReservations).reversed().thenComparing(ReportDto.StaffRow::employee))
      .toList();
    var plans=feedingPlans.findAll();
    var feeding=activeHorses.stream()
      .map(horse->feedingRow(horse,plans))
      .sorted(Comparator.comparingInt((ReportDto.FeedingRow row)->"SIN PLAN".equals(row.status())?0:1).thenComparing(ReportDto.FeedingRow::horse))
      .toList();

    long upcoming=allHealth.stream().mapToLong(ReportDto.HealthRow::upcoming).sum();
    long overdue=allHealth.stream().mapToLong(ReportDto.HealthRow::overdue).sum();
    var validReservations=reservationList.stream().filter(row->!"CANCELLED".equalsIgnoreCase(row.getStatus())).toList();
    long covered=feeding.stream().filter(row->row.planCount()>0).count();
    double coverage=activeHorses.isEmpty()?100:percent(covered,activeHorses.size());
    var summary=new ReportDto.Summary(
      activeHorses.size(),periodMedical.size(),upcoming,overdue,reservationList.size(),
      reservationList.stream().filter(row->"CANCELLED".equalsIgnoreCase(row.getStatus())).count(),
      validReservations.stream().mapToLong(row->safe(row.getParticipants())).sum(),
      validReservations.stream().mapToLong(row->safe(row.getCapacity())).sum(),
      inventoryRows.stream().filter(row->"BAJO".equals(row.status())).count(),coverage
    );
    return new ReportDto.Overview(start,end,LocalDateTime.now(),summary,health,inventoryRows,activities,staff,feeding);
  }

  private ReportDto.HealthRow healthRow(Horse horse,List<MedicalRecord> all,List<MedicalRecord> period,LocalDate today){
    var records=all.stream().filter(record->record.getHorse().getId().equals(horse.getId())).toList();
    var due=records.stream().map(MedicalRecord::getNextDueDate).filter(Objects::nonNull).toList();
    long overdue=due.stream().filter(date->date.isBefore(today)).count();
    long upcoming=due.stream().filter(date->!date.isBefore(today)&&!date.isAfter(today.plusDays(30))).count();
    LocalDate next=due.stream().filter(date->!date.isBefore(today)).min(LocalDate::compareTo).orElse(null);
    LocalDate last=records.stream().map(MedicalRecord::getDate).max(LocalDate::compareTo).orElse(null);
    long count=period.stream().filter(record->record.getHorse().getId().equals(horse.getId())).count();
    String risk=overdue>0?"VENCIDO":upcoming>0?"PRÓXIMO":"AL DÍA";
    return new ReportDto.HealthRow(horse.getId(),horse.getName(),horse.getCode(),last,count,upcoming,overdue,next,risk);
  }

  private ReportDto.InventoryRow inventoryRow(InventoryItem item,List<SupplyRecord> period){
    var own=period.stream().filter(record->record.getItem().getId().equals(item.getId())).toList();
    double inbound=own.stream().filter(record->"IN".equalsIgnoreCase(record.getType())).mapToDouble(SupplyRecord::getQuantity).sum();
    double outbound=own.stream().filter(record->"OUT".equalsIgnoreCase(record.getType())).mapToDouble(SupplyRecord::getQuantity).sum();
    return new ReportDto.InventoryRow(item.getId(),item.getName(),item.getCategory(),item.getQuantity(),item.getMinimumStock(),item.getUnit(),round(inbound),round(outbound),item.isLowStock()?"BAJO":"DISPONIBLE");
  }

  private ReportDto.ActivityRow activityRow(String type,List<Reservation> rows){
    long cancelled=rows.stream().filter(row->"CANCELLED".equalsIgnoreCase(row.getStatus())).count();
    var valid=rows.stream().filter(row->!"CANCELLED".equalsIgnoreCase(row.getStatus())).toList();
    long participants=valid.stream().mapToLong(row->safe(row.getParticipants())).sum();
    long capacity=valid.stream().mapToLong(row->safe(row.getCapacity())).sum();
    return new ReportDto.ActivityRow(type,rows.size(),cancelled,participants,capacity,percent(participants,capacity));
  }

  private ReportDto.StaffRow staffRow(Employee employee,List<Reservation> rows){
    long assigned=rows.stream().filter(row->row.getResponsible()!=null&&row.getResponsible().equalsIgnoreCase(employee.getName())&&!"CANCELLED".equalsIgnoreCase(row.getStatus())).count();
    long tasks=employee.getTasks().stream().filter(task->!"CANCELLED".equals(task.getStatus())).count();
    return new ReportDto.StaffRow(employee.getId(),employee.getName(),employee.getRole().name(),employee.getShift()==null?null:employee.getShift().getName(),assigned,tasks,employee.isActive());
  }

  private ReportDto.FeedingRow feedingRow(Horse horse,List<FeedingPlan> plans){
    var own=plans.stream().filter(plan->plan.getHorse().getId().equals(horse.getId())).toList();
    String types=own.stream().map(FeedingPlan::getFeedType).distinct().sorted().collect(Collectors.joining(", "));
    String times=own.stream().map(plan->plan.getScheduleTime().toString()).distinct().sorted().collect(Collectors.joining(", "));
    return new ReportDto.FeedingRow(horse.getId(),horse.getName(),own.size(),types,times,own.isEmpty()?"SIN PLAN":"CUBIERTO");
  }

  private int riskOrder(String risk){return "VENCIDO".equals(risk)?0:"PRÓXIMO".equals(risk)?1:2;}
  private long safe(Integer value){return value==null?0:value;}
  private double percent(long value,long total){return total==0?0:round(value*100d/total);}
  private double round(double value){return Math.round(value*10d)/10d;}
}
