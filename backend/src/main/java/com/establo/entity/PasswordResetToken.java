package com.establo.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name="password_reset_token")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PasswordResetToken {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
  @ManyToOne(optional=false,fetch=FetchType.LAZY) @JoinColumn(name="user_id") private User user;
  @Column(name="token_hash",nullable=false,unique=true,length=64) private String tokenHash;
  @Column(name="expires_at",nullable=false) private LocalDateTime expiresAt;
  @Column(name="used_at") private LocalDateTime usedAt;
  @Column(name="created_at",nullable=false) private LocalDateTime createdAt;
  public boolean isValid(LocalDateTime now){return usedAt==null&&expiresAt.isAfter(now);}
}
