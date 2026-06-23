package com.establo.service;

import com.establo.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.Set;

@Service @RequiredArgsConstructor
public class FileStorageService {
  private static final Set<String> ALLOWED = Set.of("image/jpeg", "image/png", "image/webp");
  private final HorsePhotoStorage storage;

  public Map<String,String> storeHorsePhoto(MultipartFile file) {
    if (file == null || file.isEmpty()) throw new BusinessException("Debe seleccionar una imagen");
    if (!ALLOWED.contains(file.getContentType())) throw new BusinessException("Formato no permitido. Use JPG, PNG o WebP");
    if (file.getSize() > 5 * 1024 * 1024) throw new BusinessException("La imagen no puede superar 5 MB");
    String extension = switch (file.getContentType()) { case "image/png" -> ".png"; case "image/webp" -> ".webp"; default -> ".jpg"; };
    return Map.of("url",storage.store(file,extension));
  }
}
