package com.establo.service;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
@Service @RequiredArgsConstructor @ConditionalOnProperty(name="app.mail.mode",havingValue="smtp")
public class SmtpEmailService implements EmailService{
  private final JavaMailSender sender;
  @Value("${app.mail.from}") private String from;
  public void sendPasswordReset(String recipient,String name,String resetUrl){var m=new SimpleMailMessage();m.setFrom(from);m.setTo(recipient);m.setSubject("Restablecer contraseña — Establo Horizonte");m.setText("Hola "+name+",\n\nUse este enlace durante los próximos 30 minutos para crear una contraseña nueva:\n"+resetUrl+"\n\nSi no solicitó el cambio, ignore este mensaje.");sender.send(m);}
}
