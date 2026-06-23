package com.establo.dto;
import jakarta.validation.constraints.*;
public record InventoryItemDto(Long id,@NotBlank String name,@NotBlank String category,@NotNull @PositiveOrZero Double quantity,@NotNull @PositiveOrZero Double minimumStock,@NotBlank String unit,Boolean lowStock) {}
