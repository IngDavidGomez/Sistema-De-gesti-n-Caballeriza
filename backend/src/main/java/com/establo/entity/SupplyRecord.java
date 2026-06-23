package com.establo.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SupplyRecord {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
  @ManyToOne(optional=false) private InventoryItem item;
  @Column(nullable=false) private LocalDateTime date;
  @Column(nullable=false) private String type;
  @Column(nullable=false) private Double quantity;
  @Column(nullable=false) private String responsible;
  private String notes;
}
