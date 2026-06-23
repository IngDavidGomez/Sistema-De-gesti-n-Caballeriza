package com.establo.service;

import static org.springframework.test.web.client.match.MockRestRequestMatchers.content;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.header;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

import java.nio.charset.StandardCharsets;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

class BrevoEmailServiceTest {
  @Test
  void sendsReportThroughBrevoApiWithPdfAttachment() {
    var builder = RestClient.builder();
    var server = MockRestServiceServer.bindTo(builder).build();
    var service = new BrevoEmailService(builder, "test-api-key", "caballeriza@example.com");

    server.expect(requestTo("https://api.brevo.com/v3/smtp/email"))
        .andExpect(method(HttpMethod.POST))
        .andExpect(header("api-key", "test-api-key"))
        .andExpect(content().contentType(MediaType.APPLICATION_JSON))
        .andExpect(content().json("""
            {
              "sender":{"name":"Establo Horizonte","email":"caballeriza@example.com"},
              "to":[{"email":"destino@example.com","name":"David"}],
              "subject":"Reporte operativo",
              "attachment":[{"content":"UERG","name":"reporte.pdf"}]
            }
            """, false))
        .andRespond(withSuccess("{\"messageId\":\"test-id\"}", MediaType.APPLICATION_JSON));

    service.sendReport(
        "destino@example.com",
        "David",
        "Reporte operativo",
        "Se adjunta el reporte.",
        "PDF".getBytes(StandardCharsets.UTF_8),
        "reporte.pdf");

    server.verify();
  }
}
