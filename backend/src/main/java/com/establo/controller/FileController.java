package com.establo.controller;

import com.establo.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {
  private final FileStorageService storage;
  @PostMapping(value="/horses", consumes="multipart/form-data")
  @PreAuthorize("hasAnyRole('ADMIN','CAREGIVER')")
  public Map<String,String> horsePhoto(@RequestPart("file") MultipartFile file) { return storage.storeHorsePhoto(file); }
}
