package com.establo.service;
import com.establo.dto.ReportDto;import com.lowagie.text.pdf.PdfReader;import org.junit.jupiter.api.Test;import java.time.*;import java.util.List;
import static org.assertj.core.api.Assertions.*;
class ReportPdfServiceTest{
  @Test void createsBrandedMultipageReadyPdf()throws Exception{var summary=new ReportDto.Summary(8,4,2,1,6,1,10,15,3,87.5);var health=List.of(new ReportDto.HealthRow(1L,"Luna","H-01",LocalDate.of(2026,6,20),2,1,0,LocalDate.of(2026,6,28),"PRÓXIMO"));var report=new ReportDto.Overview(LocalDate.of(2026,6,1),LocalDate.of(2026,6,30),LocalDateTime.of(2026,6,30,10,0),summary,health,List.of(),List.of(),List.of(),List.of());byte[] bytes=new ReportPdfService().generate(report);assertThat(bytes).hasSizeGreaterThan(2500);assertThat(new String(bytes,0,4)).isEqualTo("%PDF");var reader=new PdfReader(bytes);assertThat(reader.getNumberOfPages()).isGreaterThanOrEqualTo(1);assertThat(reader.getInfo().get("Title")).isEqualTo("Reporte operativo - Establo Horizonte");reader.close();}
}
