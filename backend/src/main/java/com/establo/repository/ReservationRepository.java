package com.establo.repository;
import com.establo.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
public interface ReservationRepository extends JpaRepository<Reservation,Long> {
  boolean existsByHorseIdAndStatusNotAndStartAtLessThanAndEndAtGreaterThan(Long horseId,String status,LocalDateTime endAt,LocalDateTime startAt);
  boolean existsByHorseIdAndStatusNotAndIdNotAndStartAtLessThanAndEndAtGreaterThan(Long horseId,String status,Long id,LocalDateTime endAt,LocalDateTime startAt);
}
