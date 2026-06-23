package com.establo.controller;

import com.establo.dto.AuditDto;
import com.establo.service.*;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;

@RestController @RequestMapping("/api/audit") @RequiredArgsConstructor @PreAuthorize("hasRole('ADMIN')")
public class AuditController {
  private final AuditService service;private final AuditPdfService pdf;
  @GetMapping @Operation(summary="Consultar auditoría del sistema")
  Page<AuditDto> search(@RequestParam(required=false)String username,@RequestParam(required=false)String action,@RequestParam(required=false)@DateTimeFormat(iso=DateTimeFormat.ISO.DATE)LocalDate from,@RequestParam(required=false)@DateTimeFormat(iso=DateTimeFormat.ISO.DATE)LocalDate to,@PageableDefault(size=100,sort="occurredAt",direction=Sort.Direction.DESC)Pageable pageable){return service.search(username,action,from,to,pageable);}
  @GetMapping(value="/pdf",produces=MediaType.APPLICATION_PDF_VALUE) @Operation(summary="Descargar auditoría en PDF")
  ResponseEntity<byte[]> pdf(@RequestParam(required=false)String username,@RequestParam(required=false)String action,@RequestParam(required=false)@DateTimeFormat(iso=DateTimeFormat.ISO.DATE)LocalDate from,@RequestParam(required=false)@DateTimeFormat(iso=DateTimeFormat.ISO.DATE)LocalDate to){var rows=service.export(username,action,from,to);var filename="auditoria-sistema-"+LocalDate.now()+".pdf";return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION,ContentDisposition.attachment().filename(filename).build().toString()).contentType(MediaType.APPLICATION_PDF).body(pdf.generate(rows,from,to));}
}
