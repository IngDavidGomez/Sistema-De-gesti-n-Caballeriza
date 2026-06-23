package com.establo.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MedicalRecord {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
  @ManyToOne(optional=false) private Horse horse;
  @Column(nullable=false) private LocalDate date;
  @Column(nullable=false) private String type;
  @Column(nullable=false) private String description;
  @Column(nullable=false) private String responsible;
  private LocalDate nextDueDate;
  private String observations;
}
