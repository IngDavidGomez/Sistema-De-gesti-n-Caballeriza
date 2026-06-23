package com.establo.service;

import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import org.springframework.web.client.RestClient;

@Service
@ConditionalOnProperty(name = "app.mail.mode", havingValue = "brevo")
public class BrevoEmailService implements EmailService {
  private final RestClient client;
  private final String from;

  public BrevoEmailService(
      RestClient.Builder builder,
      @Value("${app.mail.brevo-api-key}") String apiKey,
      @Value("${app.mail.from}") String from) {
    Assert.hasText(apiKey, "BREVO_API_KEY es obligatoria cuando MAIL_MODE=brevo");
    Assert.hasText(from, "MAIL_FROM es obligatorio cuando MAIL_MODE=brevo");
    this.from = from;
    this.client = builder
        .baseUrl("https://api.brevo.com/v3")
        .defaultHeader("api-key", apiKey)
        .build();
  }

  @Override
  public void sendPasswordReset(String recipient, String name, String resetUrl) {
    send(
        recipient,
        name,
        "Restablecer contraseña — Establo Horizonte",
        "Hola " + name + ",\n\nUse este enlace durante los próximos 30 minutos para crear una contraseña nueva:\n"
            + resetUrl + "\n\nSi no solicitó el cambio, ignore este mensaje.",
        List.of());
  }

  @Override
  public void sendReport(
      String recipient,
      String name,
      String subject,
      String message,
      byte[] attachment,
      String filename) {
    var encodedAttachment = Base64.getEncoder().encodeToString(attachment);
    send(
        recipient,
        name,
        subject,
        "Hola " + name + ",\n\n" + message + "\n\nEstablo Horizonte",
        List.of(Map.of("content", encodedAttachment, "name", filename)));
  }

  private void send(
      String recipient,
      String name,
      String subject,
      String textContent,
      List<Map<String, String>> attachments) {
    var body = new LinkedHashMap<String, Object>();
    body.put("sender", Map.of("name", "Establo Horizonte", "email", from));
    body.put("to", List.of(Map.of("email", recipient, "name", name)));
    body.put("subject", subject);
    body.put("textContent", textContent);
    if (!attachments.isEmpty()) {
      body.put("attachment", attachments);
    }

    client.post()
        .uri("/smtp/email")
        .contentType(MediaType.APPLICATION_JSON)
        .body(body)
        .retrieve()
        .toBodilessEntity();
  }
}
