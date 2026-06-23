package com.establo.dto;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;
public record ReservationDto(Long id,@NotNull Long horseId,String horseName,@NotNull @FutureOrPresent LocalDateTime startAt,@NotNull LocalDateTime endAt,@NotBlank String activityType,@NotBlank String responsible,String status,String observations,@Min(1) Integer capacity,@Min(1) Integer participants) {}
