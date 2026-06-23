package com.establo.service;
import org.springframework.web.multipart.MultipartFile;
public interface HorsePhotoStorage { String store(MultipartFile file,String extension); }
