package com.establo.service;

import com.establo.dto.NotificationDto;
import com.establo.entity.NotificationAlert;
import com.establo.exception.ResourceNotFoundException;
import com.establo.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.*;
import java.util.*;

@Service @RequiredArgsConstructor
public class NotificationService {
  private final NotificationAlertRepository notifications;
  private final InventoryItemRepository inventory;
  private final MedicalRecordRepository medical;

  @Transactional public void synchronize(){Set<String> active=new HashSet<>();inventory.findAll().stream().filter(i->i.isLowStock()).forEach(i->{String key="STOCK:"+i.getId();active.add(key);upsert(key,"STOCK","Stock bajo",i.getName()+" tiene "+i.getQuantity()+" "+i.getUnit()+"; mínimo: "+i.getMinimumStock());});LocalDate limit=LocalDate.now().plusDays(30);medical.findAll().stream().filter(m->m.getNextDueDate()!=null&&!m.getNextDueDate().isAfter(limit)).forEach(m->{String category="VACUNA".equalsIgnoreCase(m.getType())?"VACCINATION":"TRATAMIENTO".equalsIgnoreCase(m.getType())?"TREATMENT":"HEALTH";String key=category+":"+m.getId();active.add(key);String title=switch(category){case "VACCINATION"->"Vacunación próxima";case "TREATMENT"->m.getNextDueDate().isBefore(LocalDate.now())?"Tratamiento vencido":"Seguimiento de tratamiento";default->"Control médico próximo";};upsert(key,category,title,m.getHorse().getName()+": "+m.getDescription()+" · "+m.getNextDueDate());});notifications.findAll().stream().filter(n->n.isActive()&&!active.contains(n.getReferenceKey())).forEach(n->{n.setActive(false);notifications.save(n);});}
  public List<NotificationDto> all(){synchronize();return notifications.findByActiveTrueOrderByCreatedAtDesc().stream().map(this::dto).toList();}
  public long unread(){synchronize();return notifications.countByActiveTrueAndReadFalse();}
  public NotificationDto markRead(Long id){var n=notifications.findById(id).orElseThrow(()->new ResourceNotFoundException("Notificación no encontrada"));n.setRead(true);return dto(notifications.save(n));}
  public void markAllRead(){notifications.findByActiveTrueOrderByCreatedAtDesc().forEach(n->{n.setRead(true);notifications.save(n);});}
  private void upsert(String key,String category,String title,String message){var n=notifications.findByReferenceKey(key).orElseGet(()->NotificationAlert.builder().referenceKey(key).createdAt(LocalDateTime.now()).build());n.setCategory(category);n.setTitle(title);n.setMessage(message);n.setActive(true);notifications.save(n);}
  private NotificationDto dto(NotificationAlert n){return new NotificationDto(n.getId(),n.getCategory(),n.getTitle(),n.getMessage(),n.getCreatedAt(),n.isRead());}
}
