package com.establo.service;
import com.establo.exception.BusinessException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;
@Component @ConditionalOnProperty(name="app.storage.provider",havingValue="local",matchIfMissing=true)
public class LocalHorsePhotoStorage implements HorsePhotoStorage{
  private final Path root;
  public LocalHorsePhotoStorage(@Value("${app.storage.local-dir:uploads/horses}")String dir){root=Paths.get(dir).toAbsolutePath().normalize();try{Files.createDirectories(root);}catch(IOException e){throw new IllegalStateException("No se pudo preparar el almacenamiento local",e);}}
  public String store(MultipartFile file,String extension){String name=UUID.randomUUID()+extension;try{Files.copy(file.getInputStream(),root.resolve(name),StandardCopyOption.REPLACE_EXISTING);return "/uploads/horses/"+name;}catch(IOException e){throw new BusinessException("No se pudo guardar la imagen");}}
  public Path root(){return root;}
}
