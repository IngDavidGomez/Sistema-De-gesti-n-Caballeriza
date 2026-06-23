package com.establo.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Horse {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
  @Column(nullable=false,unique=true) private String code;
  @Column(nullable=false) private String name;
  private LocalDate birthDate;
  @Column(nullable=false) private String breed;
  @Column(nullable=false) private String sex;
  private Double weight;
  private String photoUrl;
  @Builder.Default private boolean active=true;
}
