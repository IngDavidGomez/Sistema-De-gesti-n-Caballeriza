package com.establo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name="users") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class User {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
  @Column(nullable=false) private String name;
  @Column(nullable=false,unique=true) private String email;
  @Column(nullable=false) private String password;
  @Column(name="google_subject",unique=true) private String googleSubject;
  @Enumerated(EnumType.STRING) @Column(nullable=false) private Role role;
  @Builder.Default private boolean active=true;
}
