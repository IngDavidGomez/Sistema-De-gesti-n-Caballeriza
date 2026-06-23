package com.establo.service;
import com.establo.dto.MedicalRecordDto;
import com.establo.entity.MedicalRecord;
import com.establo.exception.ResourceNotFoundException;
import com.establo.repository.MedicalRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
@Service @RequiredArgsConstructor
public class MedicalRecordService {
 private final MedicalRecordRepository repo; private final HorseService horses;
 public List<MedicalRecordDto> byHorse(Long id){horses.entity(id);return repo.findByHorseIdOrderByDateDesc(id).stream().map(this::dto).toList();}
 public MedicalRecordDto create(MedicalRecordDto d){return dto(repo.save(apply(new MedicalRecord(),d)));}
 public MedicalRecordDto update(Long id,MedicalRecordDto d){return dto(repo.save(apply(entity(id),d)));}
 public void delete(Long id){repo.delete(entity(id));}
 private MedicalRecord entity(Long id){return repo.findById(id).orElseThrow(()->new ResourceNotFoundException("Registro médico no encontrado"));}
 private MedicalRecord apply(MedicalRecord r,MedicalRecordDto d){r.setHorse(horses.entity(d.horseId()));r.setDate(d.date());r.setType(d.type());r.setDescription(d.description());r.setResponsible(d.responsible());r.setNextDueDate(d.nextDueDate());r.setObservations(d.observations());return r;}
 private MedicalRecordDto dto(MedicalRecord r){return new MedicalRecordDto(r.getId(),r.getHorse().getId(),r.getHorse().getName(),r.getDate(),r.getType(),r.getDescription(),r.getResponsible(),r.getNextDueDate(),r.getObservations());}
}
