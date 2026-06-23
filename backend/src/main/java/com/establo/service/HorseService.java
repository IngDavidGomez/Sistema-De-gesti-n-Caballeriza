package com.establo.service;
import com.establo.dto.HorseDto;
import com.establo.entity.Horse;
import com.establo.exception.*;
import com.establo.repository.HorseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.*;
import java.util.List;
import java.time.LocalDate;
import java.time.Period;

@Service @RequiredArgsConstructor
public class HorseService {
  private final HorseRepository repository;
  public List<HorseDto> findAll(){return repository.findAll().stream().map(this::toDto).toList();}
  public Page<HorseDto> search(String q,Pageable pageable){var filtered=findAll().stream().filter(h->q==null||q.isBlank()||(h.code()+" "+h.name()+" "+h.breed()+" "+h.sex()).toLowerCase().contains(q.toLowerCase())).toList();int start=(int)Math.min(pageable.getOffset(),filtered.size());int end=Math.min(start+pageable.getPageSize(),filtered.size());return new PageImpl<>(filtered.subList(start,end),pageable,filtered.size());}
  public HorseDto find(Long id){return toDto(entity(id));}
  public HorseDto create(HorseDto d){if(repository.existsByCodeIgnoreCase(d.code()))throw new BusinessException("El identificador ya existe");return toDto(repository.save(apply(new Horse(),d)));}
  public HorseDto update(Long id,HorseDto d){var h=entity(id);if(!h.getCode().equalsIgnoreCase(d.code())&&repository.existsByCodeIgnoreCase(d.code()))throw new BusinessException("El identificador ya existe");return toDto(repository.save(apply(h,d)));}
  public void delete(Long id){repository.delete(entity(id));}
  public Horse entity(Long id){return repository.findById(id).orElseThrow(()->new ResourceNotFoundException("Caballo no encontrado"));}
  private Horse apply(Horse h,HorseDto d){h.setCode(d.code());h.setName(d.name());h.setBirthDate(d.birthDate());h.setBreed(d.breed());h.setSex(d.sex());h.setWeight(d.weight());h.setPhotoUrl(d.photoUrl());if(d.active()!=null)h.setActive(d.active());return h;}
  private HorseDto toDto(Horse h){Integer age=h.getBirthDate()==null?null:Period.between(h.getBirthDate(),LocalDate.now()).getYears();return new HorseDto(h.getId(),h.getCode(),h.getName(),h.getBirthDate(),h.getBreed(),h.getSex(),h.getWeight(),h.getPhotoUrl(),age,h.isActive());}
}
