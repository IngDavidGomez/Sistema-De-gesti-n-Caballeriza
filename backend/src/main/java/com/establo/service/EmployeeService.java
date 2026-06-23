package com.establo.service;
import com.establo.dto.EmployeeDto;import com.establo.entity.*;import com.establo.exception.ResourceNotFoundException;import com.establo.repository.*;import lombok.RequiredArgsConstructor;import org.springframework.stereotype.Service;import org.springframework.transaction.annotation.Transactional;import java.time.LocalTime;import java.util.*;import java.util.stream.Collectors;
@Service @RequiredArgsConstructor
public class EmployeeService{
 private final EmployeeRepository repo;private final WorkShiftRepository shifts;
 @Transactional(readOnly=true) public List<EmployeeDto> all(){return repo.findAll().stream().map(this::dto).toList();}
 @Transactional public EmployeeDto create(EmployeeDto d){return dto(repo.save(apply(new Employee(),d)));}
 @Transactional public EmployeeDto update(Long id,EmployeeDto d){return dto(repo.save(apply(entity(id),d)));}
 @Transactional public void delete(Long id){repo.delete(entity(id));}
 private Employee entity(Long id){return repo.findById(id).orElseThrow(()->new ResourceNotFoundException("Empleado no encontrado"));}
 private Employee apply(Employee e,EmployeeDto d){e.setName(d.name());e.setRole(d.role());e.setContact(d.contact());e.setShift(resolveShift(d.shift()));e.getTasks().clear();if(d.tasks()!=null)Arrays.stream(d.tasks().split("[,;\\n]")).map(String::trim).filter(x->!x.isBlank()).forEach(title->e.getTasks().add(EmployeeTask.builder().employee(e).title(title).build()));if(d.active()!=null)e.setActive(d.active());return e;}
 private WorkShift resolveShift(String value){if(value==null||value.isBlank())return null;return shifts.findByNameIgnoreCase(value.trim()).orElseGet(()->{LocalTime start=null,end=null;try{var parts=value.split("\\s*-\\s*");if(parts.length==2){start=LocalTime.parse(parts[0]);end=LocalTime.parse(parts[1]);}}catch(Exception ignored){}return shifts.save(WorkShift.builder().name(value.trim()).startTime(start).endTime(end).build());});}
 private EmployeeDto dto(Employee e){String tasks=e.getTasks().stream().map(EmployeeTask::getTitle).collect(Collectors.joining("; "));return new EmployeeDto(e.getId(),e.getName(),e.getRole(),e.getContact(),e.getShift()==null?null:e.getShift().getName(),tasks,e.isActive());}
}
