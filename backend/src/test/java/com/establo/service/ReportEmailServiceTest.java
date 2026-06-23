package com.establo.service;

import com.establo.dto.ReportDto;
import com.establo.entity.Role;
import com.establo.entity.User;
import com.establo.exception.BusinessException;
import com.establo.repository.UserRepository;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class ReportEmailServiceTest {
  UserRepository users=mock(UserRepository.class);
  ReportService reports=mock(ReportService.class);
  ReportPdfService pdf=mock(ReportPdfService.class);
  EmailService email=mock(EmailService.class);
  ReportEmailService service=new ReportEmailService(users,reports,pdf,email);

  @Test void sendsOnePdfToEachSelectedActiveUser(){
    var ana=user(1L,"Ana","ana@test.com",true);
    var luis=user(2L,"Luis","luis@test.com",true);
    var from=LocalDate.of(2026,6,1);var to=LocalDate.of(2026,6,30);
    var report=overview(from,to);
    when(users.findAllById(List.of(1L,2L))).thenReturn(List.of(ana,luis));
    when(reports.overview(from,to,false)).thenReturn(report);
    when(pdf.generate(report)).thenReturn(new byte[]{1,2,3});

    var result=service.send(new ReportDto.EmailRequest(List.of(1L,2L),from,to,false));

    assertThat(result.sent()).isEqualTo(2);
    verify(email).sendReport(eq("ana@test.com"),eq("Ana"),contains("01/06/2026"),anyString(),any(byte[].class),endsWith(".pdf"));
    verify(email).sendReport(eq("luis@test.com"),eq("Luis"),contains("30/06/2026"),anyString(),any(byte[].class),endsWith(".pdf"));
    verify(pdf).generate(report);
  }

  @Test void rejectsInactiveRecipientBeforeGeneratingReport(){
    when(users.findAllById(List.of(1L))).thenReturn(List.of(user(1L,"Ana","ana@test.com",false)));
    var request=new ReportDto.EmailRequest(List.of(1L),LocalDate.now(),LocalDate.now(),false);
    assertThatThrownBy(()->service.send(request)).isInstanceOf(BusinessException.class).hasMessageContaining("inactivos");
    verifyNoInteractions(reports,pdf,email);
  }

  @Test void listsOnlyActiveRecipientsAlphabetically(){
    when(users.findAll()).thenReturn(List.of(user(2L,"Zoe","zoe@test.com",false),user(1L,"Ana","ana@test.com",true)));
    assertThat(service.recipients()).extracting(ReportDto.Recipient::name).containsExactly("Ana");
  }

  private User user(Long id,String name,String address,boolean active){return User.builder().id(id).name(name).email(address).role(Role.CAREGIVER).active(active).build();}
  private ReportDto.Overview overview(LocalDate from,LocalDate to){
    var summary=new ReportDto.Summary(0,0,0,0,0,0,0,0,0,0);
    return new ReportDto.Overview(from,to,LocalDateTime.now(),summary,List.of(),List.of(),List.of(),List.of(),List.of());
  }
}
