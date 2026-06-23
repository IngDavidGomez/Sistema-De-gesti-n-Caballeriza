package com.establo.dto;
import jakarta.validation.constraints.*;
import java.time.LocalTime;
public record FeedingPlanDto(Long id,@NotNull Long horseId,String horseName,@NotBlank String feedType,@NotNull @Positive Double quantity,@NotBlank String unit,@NotNull LocalTime scheduleTime,String notes) {}
