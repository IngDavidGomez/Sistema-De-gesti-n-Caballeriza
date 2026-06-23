package com.establo.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Reservation {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
  @ManyToOne(optional=false) private Horse horse;
  @Column(nullable=false) private LocalDateTime startAt;
  @Column(nullable=false) private LocalDateTime endAt;
  @Column(nullable=false) private String activityType;
  @Column(nullable=false) private String responsible;
  @Column(nullable=false) private String status;
  private String observations;
  @Builder.Default private Integer capacity=1;
  @Builder.Default private Integer participants=1;
  @Version private Long version;
}
