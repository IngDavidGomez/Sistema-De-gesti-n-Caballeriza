package com.establo.service;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
@Slf4j @Service @ConditionalOnProperty(name="app.mail.mode",havingValue="log",matchIfMissing=true)
public class LogEmailService implements EmailService{
  public void sendPasswordReset(String recipient,String name,String resetUrl){log.info("Correo de recuperación para {} ({}): {}",name,recipient,resetUrl);}
  public void sendReport(String recipient,String name,String subject,String message,byte[] attachment,String filename){log.info("Reporte {} ({} bytes) enviado a {} ({}) con asunto: {}",filename,attachment.length,name,recipient,subject);}
}
