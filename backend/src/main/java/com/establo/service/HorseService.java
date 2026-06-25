package com.establo.service;
import com.establo.dto.HorseDto;
import com.establo.entity.Horse;
import com.establo.exception.*;
import com.establo.repository.HorseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;
import java.util.List;
import java.util.Set;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;

@Service @RequiredArgsConstructor
public class HorseService {
  private static final Set<String> ALLOWED_PHOTO_TYPES = Set.of("image/jpeg", "image/png", "image/webp");
  private final HorseRepository repository;
  public List<HorseDto> findAll(){return repository.findAll().stream().map(this::toDto).toList();}
  public Page<HorseDto> search(String q,Pageable pageable){var filtered=findAll().stream().filter(h->q==null||q.isBlank()||(h.code()+" "+h.name()+" "+h.breed()+" "+h.sex()).toLowerCase().contains(q.toLowerCase())).toList();int start=(int)Math.min(pageable.getOffset(),filtered.size());int end=Math.min(start+pageable.getPageSize(),filtered.size());return new PageImpl<>(filtered.subList(start,end),pageable,filtered.size());}
  public HorseDto find(Long id){return toDto(entity(id));}
  public HorseDto create(HorseDto d){if(repository.existsByCodeIgnoreCase(d.code()))throw new BusinessException("El identificador ya existe");return toDto(repository.save(apply(new Horse(),d)));}
  public HorseDto update(Long id,HorseDto d){var h=entity(id);if(!h.getCode().equalsIgnoreCase(d.code())&&repository.existsByCodeIgnoreCase(d.code()))throw new BusinessException("El identificador ya existe");return toDto(repository.save(apply(h,d)));}
  public HorseDto updatePhoto(Long id, MultipartFile file){
    if(file==null||file.isEmpty())throw new BusinessException("Debe seleccionar una imagen");
    if(!ALLOWED_PHOTO_TYPES.contains(file.getContentType()))throw new BusinessException("Formato no permitido. Use JPG, PNG o WebP");
    if(file.getSize()>5*1024*1024)throw new BusinessException("La imagen no puede superar 5 MB");
    var h=entity(id);
    try{
      h.setPhotoData(file.getBytes());
      h.setPhotoContentType(file.getContentType());
      h.setPhotoFileName(file.getOriginalFilename());
      h.setPhotoUpdatedAt(LocalDateTime.now());
      h.setPhotoUrl(photoUrl(h));
      return toDto(repository.save(h));
    }catch(IOException e){throw new BusinessException("No se pudo guardar la imagen");}
  }
  public HorsePhoto photo(Long id){
    var h=entity(id);
    if(h.getPhotoData()==null||h.getPhotoData().length==0)throw new ResourceNotFoundException("Foto no encontrada");
    var type=h.getPhotoContentType()==null||h.getPhotoContentType().isBlank()?MediaType.APPLICATION_OCTET_STREAM_VALUE:h.getPhotoContentType();
    return new HorsePhoto(h.getPhotoData(),type,h.getPhotoFileName());
  }
  public void delete(Long id){repository.delete(entity(id));}
  public Horse entity(Long id){return repository.findById(id).orElseThrow(()->new ResourceNotFoundException("Caballo no encontrado"));}
  private Horse apply(Horse h,HorseDto d){h.setCode(d.code());h.setName(d.name());h.setBirthDate(d.birthDate());h.setBreed(d.breed());h.setSex(d.sex());h.setWeight(d.weight());h.setPhotoUrl(d.photoUrl());if(d.active()!=null)h.setActive(d.active());return h;}
  private String photoUrl(Horse h){return h.getPhotoData()!=null&&h.getPhotoData().length>0?"/api/horses/"+h.getId()+"/photo"+(h.getPhotoUpdatedAt()==null?"":"?v="+h.getPhotoUpdatedAt().toString().replace(":","")):h.getPhotoUrl();}
  private HorseDto toDto(Horse h){Integer age=h.getBirthDate()==null?null:Period.between(h.getBirthDate(),LocalDate.now()).getYears();return new HorseDto(h.getId(),h.getCode(),h.getName(),h.getBirthDate(),h.getBreed(),h.getSex(),h.getWeight(),photoUrl(h),age,h.isActive());}
  public record HorsePhoto(byte[] data,String contentType,String fileName){}
}
