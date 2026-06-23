package com.establo.dto;
import com.establo.entity.EmployeeRole;
import jakarta.validation.constraints.*;
public record EmployeeDto(Long id,@NotBlank String name,@NotNull EmployeeRole role,@NotBlank String contact,String shift,String tasks,Boolean active) {}
