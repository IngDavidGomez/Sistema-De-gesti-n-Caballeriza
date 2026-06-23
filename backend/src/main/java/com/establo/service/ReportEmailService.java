package com.establo.service;

import com.establo.dto.ReportDto;
import com.establo.entity.User;
import com.establo.exception.BusinessException;
import com.establo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportEmailService {
  private final UserRepository users;
  private final ReportService reports;
  private final ReportPdfService pdf;
  private final EmailService email;

  public List<ReportDto.Recipient> recipients(){
    return users.findAll().stream().filter(User::isActive)
      .sorted((a,b)->a.getName().compareToIgnoreCase(b.getName()))
      .map(u->new ReportDto.Recipient(u.getId(),u.getName(),u.getEmail(),u.getRole().name())).toList();
  }

  public ReportDto.EmailResult send(ReportDto.EmailRequest request){
    var ids=request.recipientIds().stream().distinct().toList();
    var recipients=users.findAllById(ids);
    if(recipients.size()!=ids.size()) throw new BusinessException("Uno o más destinatarios no existen");
    if(recipients.stream().anyMatch(u->!u.isActive())) throw new BusinessException("No se puede enviar el reporte a usuarios inactivos");
    var report=reports.overview(request.from(),request.to(),request.allHorses());
    var attachment=pdf.generate(report);
    var period=report.from().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))+" al "+report.to().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
    var filename="reporte-operativo-"+report.from()+"-"+report.to()+".pdf";
    for(var recipient:recipients){
      email.sendReport(recipient.getEmail(),recipient.getName(),"Reporte operativo — "+period,"Se adjunta el reporte operativo correspondiente al período "+period+".",attachment,filename);
    }
    return new ReportDto.EmailResult(recipients.size(),"Reporte enviado correctamente");
  }
}
