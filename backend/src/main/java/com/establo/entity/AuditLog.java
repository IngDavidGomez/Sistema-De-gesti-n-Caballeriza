package com.establo.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name="user_audit_event")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AuditLog {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
  @Column(nullable=false,length=160) private String username;
  @Column(name="user_role",nullable=false,length=40) private String userRole;
  @Column(nullable=false,length=40) private String action;
  @Column(nullable=false,length=80) private String resource;
  @Column(name="http_method",nullable=false,length=10) private String httpMethod;
  @Column(nullable=false,length=300) private String endpoint;
  @Column(length=500) private String details;
  @Column(name="status_code",nullable=false) private int statusCode;
  @Column(nullable=false) private boolean success;
  @Column(name="ip_address",length=64) private String ipAddress;
  @Column(name="user_agent",length=300) private String userAgent;
  @Column(name="occurred_at",nullable=false,updatable=false) private LocalDateTime occurredAt;

  @PrePersist void beforeInsert(){if(occurredAt==null)occurredAt=LocalDateTime.now();}
}
