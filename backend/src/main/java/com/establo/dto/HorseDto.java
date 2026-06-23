package com.establo.dto;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
public record HorseDto(Long id,@NotBlank String code,@NotBlank String name,@Past LocalDate birthDate,@NotBlank String breed,@NotBlank String sex,@Positive Double weight,String photoUrl,Integer age,Boolean active) {}
