package com.establo.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalTime;

@Entity @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class FeedingPlan {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
  @ManyToOne(optional=false) private Horse horse;
  @Column(nullable=false) private String feedType;
  @Column(nullable=false) private Double quantity;
  @Column(nullable=false) private String unit;
  @Column(nullable=false) private LocalTime scheduleTime;
  private String notes;
}
