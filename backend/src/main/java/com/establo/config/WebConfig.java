package com.establo.config;

import com.establo.service.LocalHorsePhotoStorage;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
@ConditionalOnProperty(name="app.storage.provider",havingValue="local",matchIfMissing=true)
public class WebConfig implements WebMvcConfigurer {
  private final LocalHorsePhotoStorage storage;
  @Override public void addResourceHandlers(ResourceHandlerRegistry registry) {
    registry.addResourceHandler("/uploads/horses/**").addResourceLocations(storage.root().toUri().toString());
  }
}
