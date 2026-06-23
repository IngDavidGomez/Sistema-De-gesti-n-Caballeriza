package com.establo.dto;

import java.time.LocalDateTime;

public record AuditDto(
  Long id,String username,String role,String action,String resource,String method,
  String endpoint,String details,int statusCode,boolean success,String ipAddress,
  LocalDateTime occurredAt
) {}
