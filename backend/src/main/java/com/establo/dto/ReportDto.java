package com.establo.dto;
import jakarta.validation.constraints.NotEmpty;import jakarta.validation.constraints.Size;import java.time.*;import java.util.List;
public final class ReportDto{
  private ReportDto(){}
  public record Overview(LocalDate from,LocalDate to,LocalDateTime generatedAt,Summary summary,List<HealthRow> health,List<InventoryRow> inventory,List<ActivityRow> activities,List<StaffRow> staff,List<FeedingRow> feeding){}
  public record Summary(long activeHorses,long medicalEvents,long upcomingCare,long overdueCare,long reservations,long cancelledReservations,long participants,long totalCapacity,long lowStockItems,double feedingCoveragePercent){}
  public record HealthRow(Long horseId,String horse,String code,LocalDate lastRecord,long recordsInPeriod,long upcoming,long overdue,LocalDate nextDueDate,String risk){}
  public record InventoryRow(Long itemId,String item,String category,double stock,double minimum,String unit,double inbound,double outbound,String status){}
  public record ActivityRow(String activity,long reservations,long cancelled,long participants,long capacity,double occupancyPercent){}
  public record StaffRow(Long employeeId,String employee,String role,String shift,long assignedReservations,long taskCount,boolean active){}
  public record FeedingRow(Long horseId,String horse,long planCount,String feedTypes,String schedules,String status){}
  public record Recipient(Long id,String name,String email,String role){}
  public record EmailRequest(@NotEmpty(message="Seleccione al menos un destinatario") @Size(max=25,message="No puede enviar el reporte a más de 25 destinatarios") List<Long> recipientIds,LocalDate from,LocalDate to,boolean allHorses){}
  public record EmailResult(int sent,String message){}
}
