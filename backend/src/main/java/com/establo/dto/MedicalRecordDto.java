package com.establo.dto;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
public record MedicalRecordDto(Long id,@NotNull Long horseId,String horseName,@NotNull @PastOrPresent LocalDate date,@NotBlank String type,@NotBlank String description,@NotBlank String responsible,LocalDate nextDueDate,String observations) {}
