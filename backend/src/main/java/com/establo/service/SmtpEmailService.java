package com.establo.service;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.stereotype.Service;
@Service @RequiredArgsConstructor @ConditionalOnProperty(name="app.mail.mode",havingValue="smtp")
public class SmtpEmailService implements EmailService{
  private final JavaMailSender sender;
  @Value("${app.mail.from}") private String from;
  public void sendPasswordReset(String recipient,String name,String resetUrl){var m=new SimpleMailMessage();m.setFrom(from);m.setTo(recipient);m.setSubject("Restablecer contraseña — Establo Horizonte");m.setText("Hola "+name+",\n\nUse este enlace durante los próximos 30 minutos para crear una contraseña nueva:\n"+resetUrl+"\n\nSi no solicitó el cambio, ignore este mensaje.");sender.send(m);}
  public void sendReport(String recipient,String name,String subject,String message,byte[] attachment,String filename){
    var mime=sender.createMimeMessage();
    try{
      var helper=new MimeMessageHelper(mime,true,"UTF-8");
      helper.setFrom(from);helper.setTo(recipient);helper.setSubject(subject);
      helper.setText("Hola "+name+",\n\n"+message+"\n\nEstablo Horizonte");
      helper.addAttachment(filename,new ByteArrayResource(attachment),"application/pdf");
      sender.send(mime);
    }catch(jakarta.mail.MessagingException e){throw new IllegalStateException("No se pudo preparar el correo del reporte",e);}
  }
}
