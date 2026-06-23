package com.establo.service;

import com.establo.dto.AuditDto;
import org.junit.jupiter.api.Test;
import java.time.*;
import java.util.List;
import static org.assertj.core.api.Assertions.assertThat;

class AuditPdfServiceTest {
  @Test void generatesValidPdf(){var row=new AuditDto(1L,"admin@establo.cr","ADMIN","ACTUALIZAR","Personal","PUT","/api/employees/1","Actualizar en Personal",200,true,"127.0.0.1",LocalDateTime.now());var bytes=new AuditPdfService().generate(List.of(row),LocalDate.now().minusDays(7),LocalDate.now());assertThat(bytes).startsWith("%PDF".getBytes()).hasSizeGreaterThan(1000);}
}
