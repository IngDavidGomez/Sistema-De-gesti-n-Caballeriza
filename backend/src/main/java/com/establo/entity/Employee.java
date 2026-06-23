package com.establo.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.*;

@Entity @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Employee {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
  @Column(nullable=false) private String name;
  @Enumerated(EnumType.STRING) @Column(nullable=false) private EmployeeRole role;
  @Column(nullable=false) private String contact;
  @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="shift_id") private WorkShift shift;
  @OneToMany(mappedBy="employee",cascade=CascadeType.ALL,orphanRemoval=true) @Builder.Default private List<EmployeeTask> tasks=new ArrayList<>();
  @Builder.Default private boolean active=true;
}
