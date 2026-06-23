package com.establo.entity;
import jakarta.persistence.*;import lombok.*;import java.time.LocalTime;
@Entity @Table(name="work_shift") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class WorkShift{@Id @GeneratedValue(strategy=GenerationType.IDENTITY)private Long id;@Column(nullable=false,unique=true)private String name;private LocalTime startTime;private LocalTime endTime;@Builder.Default private boolean active=true;}
