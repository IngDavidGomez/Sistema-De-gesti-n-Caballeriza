package com.establo.entity;
import jakarta.persistence.*;import lombok.*;import java.time.*;
@Entity @Table(name="employee_task") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class EmployeeTask{@Id @GeneratedValue(strategy=GenerationType.IDENTITY)private Long id;@ManyToOne(optional=false,fetch=FetchType.LAZY)@JoinColumn(name="employee_id")private Employee employee;@Column(nullable=false)private String title;@Builder.Default @Column(nullable=false)private String status="PENDING";@Builder.Default @Column(nullable=false)private String priority="MEDIUM";private LocalDate dueDate;private LocalDateTime completedAt;@Builder.Default @Column(nullable=false)private LocalDateTime createdAt=LocalDateTime.now();}
