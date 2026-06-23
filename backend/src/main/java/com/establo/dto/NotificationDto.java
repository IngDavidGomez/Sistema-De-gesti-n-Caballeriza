package com.establo.dto;
import java.time.LocalDateTime;
public record NotificationDto(Long id,String category,String title,String message,LocalDateTime createdAt,boolean read) {}
