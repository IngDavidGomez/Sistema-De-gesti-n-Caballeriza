package com.establo.repository;
import com.establo.entity.NotificationAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface NotificationAlertRepository extends JpaRepository<NotificationAlert,Long> {
  Optional<NotificationAlert> findByReferenceKey(String key);
  List<NotificationAlert> findByActiveTrueOrderByCreatedAtDesc();
  long countByActiveTrueAndReadFalse();
}
