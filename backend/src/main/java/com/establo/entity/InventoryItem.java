package com.establo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class InventoryItem {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
  @Column(nullable=false,unique=true) private String name;
  @Column(nullable=false) private String category;
  @Column(nullable=false) private Double quantity;
  @Column(nullable=false) private Double minimumStock;
  @Column(nullable=false) private String unit;
  @Version private Long version;
  public boolean isLowStock() { return quantity <= minimumStock; }
}
