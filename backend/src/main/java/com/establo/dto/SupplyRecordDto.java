package com.establo.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

public record SupplyRecordDto(Long id,@NotNull Long itemId,String itemName,@NotNull LocalDateTime date,@NotBlank @Pattern(regexp="IN|OUT") String type,@NotNull @Positive Double quantity,@NotBlank String responsible,String notes,String unit) {}
