package com.establo.service;
public interface EmailService {
  void sendPasswordReset(String recipient,String name,String resetUrl);
  void sendReport(String recipient,String name,String subject,String message,byte[] attachment,String filename);
}
