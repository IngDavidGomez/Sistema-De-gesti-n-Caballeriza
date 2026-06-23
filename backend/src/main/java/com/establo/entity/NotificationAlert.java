package com.establo.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class NotificationAlert {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
  @Column(nullable=false,unique=true) private String referenceKey;
  @Column(nullable=false) private String category;
  @Column(nullable=false) private String title;
  @Column(nullable=false,length=700) private String message;
  @Column(nullable=false) private LocalDateTime createdAt;
  @Builder.Default @Column(name="is_read",nullable=false) private boolean read=false;
  @Builder.Default @Column(nullable=false) private boolean active=true;
}
