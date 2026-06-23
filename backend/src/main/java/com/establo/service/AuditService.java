package com.establo.service;

import com.establo.dto.AuditDto;
import com.establo.entity.AuditLog;
import com.establo.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.*;
import java.time.*;
import java.util.List;

@Service @RequiredArgsConstructor
public class AuditService {
  private final AuditLogRepository repository;

  @Transactional(propagation=Propagation.REQUIRES_NEW)
  public void record(String username,String role,String action,String resource,String method,String endpoint,String details,int statusCode,String ipAddress,String userAgent){
    repository.save(AuditLog.builder()
      .username(limit(username,160)).userRole(limit(role,40)).action(limit(action,40))
      .resource(limit(resource,80)).httpMethod(limit(method,10)).endpoint(limit(endpoint,300))
      .details(limit(details,500)).statusCode(statusCode).success(statusCode<400)
      .ipAddress(limit(ipAddress,64)).userAgent(limit(userAgent,300)).occurredAt(LocalDateTime.now()).build());
  }

  @Transactional(readOnly=true)
  public Page<AuditDto> search(String username,String action,LocalDate from,LocalDate to,Pageable pageable){
    return repository.findAll(specification(username,action,from,to),pageable).map(this::dto);
  }

  @Transactional(readOnly=true)
  public List<AuditDto> export(String username,String action,LocalDate from,LocalDate to){
    var page=PageRequest.of(0,5000,Sort.by(Sort.Direction.DESC,"occurredAt"));
    return repository.findAll(specification(username,action,from,to),page).stream().map(this::dto).toList();
  }

  private Specification<AuditLog> specification(String username,String action,LocalDate from,LocalDate to){
    Specification<AuditLog> spec=(root,query,cb)->cb.conjunction();
    if(username!=null&&!username.isBlank())spec=spec.and((root,query,cb)->cb.like(cb.lower(root.get("username")),"%"+username.trim().toLowerCase()+"%"));
    if(action!=null&&!action.isBlank())spec=spec.and((root,query,cb)->cb.equal(root.get("action"),action.trim()));
    if(from!=null)spec=spec.and((root,query,cb)->cb.greaterThanOrEqualTo(root.get("occurredAt"),from.atStartOfDay()));
    if(to!=null)spec=spec.and((root,query,cb)->cb.lessThan(root.get("occurredAt"),to.plusDays(1).atStartOfDay()));
    return spec;
  }

  private AuditDto dto(AuditLog row){return new AuditDto(row.getId(),row.getUsername(),row.getUserRole(),row.getAction(),row.getResource(),row.getHttpMethod(),row.getEndpoint(),row.getDetails(),row.getStatusCode(),row.isSuccess(),row.getIpAddress(),row.getOccurredAt());}
  private String limit(String value,int max){if(value==null)return null;return value.length()<=max?value:value.substring(0,max);}
}
