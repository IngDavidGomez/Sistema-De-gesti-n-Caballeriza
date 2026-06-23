package com.establo.controller;

import com.establo.dto.ReportDto;
import com.establo.service.ReportPdfService;
import com.establo.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN','CAREGIVER','VETERINARIAN')")
public class ReportController {
  private final ReportService service;
  private final ReportPdfService pdf;

  @GetMapping("/overview")
  @Operation(summary="Reporte operativo integral",description="Consolida salud, inventario, reservas, personal y alimentación para un período máximo de un año.")
  ReportDto.Overview overview(
    @RequestParam(required=false) @DateTimeFormat(iso=DateTimeFormat.ISO.DATE) LocalDate from,
    @RequestParam(required=false) @DateTimeFormat(iso=DateTimeFormat.ISO.DATE) LocalDate to,
    @RequestParam(defaultValue="false") boolean allHorses
  ){
    return service.overview(from,to,allHorses);
  }

  @GetMapping(value="/overview.pdf",produces=MediaType.APPLICATION_PDF_VALUE)
  @Operation(summary="Descargar reporte operativo en PDF",description="Genera un documento profesional con resumen ejecutivo y cinco secciones detalladas.")
  ResponseEntity<byte[]> pdf(
    @RequestParam(required=false) @DateTimeFormat(iso=DateTimeFormat.ISO.DATE) LocalDate from,
    @RequestParam(required=false) @DateTimeFormat(iso=DateTimeFormat.ISO.DATE) LocalDate to,
    @RequestParam(defaultValue="false") boolean allHorses
  ){
    var report=service.overview(from,to,allHorses);
    var filename="reporte-operativo-"+report.from()+"-"+report.to()+".pdf";
    return ResponseEntity.ok()
      .header(HttpHeaders.CONTENT_DISPOSITION,ContentDisposition.attachment().filename(filename).build().toString())
      .contentType(MediaType.APPLICATION_PDF)
      .body(pdf.generate(report));
  }
}
