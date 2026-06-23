package com.establo.service;
import com.establo.exception.BusinessException;import org.junit.jupiter.api.Test;import org.springframework.mock.web.MockMultipartFile;
import static org.assertj.core.api.Assertions.*;import static org.mockito.Mockito.*;
class FileStorageServiceTest{
  HorsePhotoStorage storage=mock(HorsePhotoStorage.class);FileStorageService service=new FileStorageService(storage);
  @Test void storesValidatedImage(){var file=new MockMultipartFile("file","horse.webp","image/webp",new byte[]{1,2});when(storage.store(file,".webp")).thenReturn("https://cdn.test/horses/1.webp");assertThat(service.storeHorsePhoto(file)).containsEntry("url","https://cdn.test/horses/1.webp");}
  @Test void rejectsExecutableContent(){var file=new MockMultipartFile("file","bad.exe","application/octet-stream",new byte[]{1});assertThatThrownBy(()->service.storeHorsePhoto(file)).isInstanceOf(BusinessException.class).hasMessageContaining("Formato");verifyNoInteractions(storage);}
}
