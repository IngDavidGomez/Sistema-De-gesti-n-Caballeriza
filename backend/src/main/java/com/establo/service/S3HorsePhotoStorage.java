package com.establo.service;
import com.establo.exception.BusinessException;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.*;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.*;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import java.net.URI;
import java.util.UUID;
@Component @ConditionalOnProperty(name="app.storage.provider",havingValue="s3")
public class S3HorsePhotoStorage implements HorsePhotoStorage{
  @Value("${app.storage.s3.bucket:}")String bucket;@Value("${app.storage.s3.region:us-east-1}")String region;@Value("${app.storage.s3.endpoint:}")String endpoint;@Value("${app.storage.s3.access-key:}")String accessKey;@Value("${app.storage.s3.secret-key:}")String secretKey;@Value("${app.storage.public-base-url:}")String publicBaseUrl;
  private S3Client client;
  @PostConstruct void init(){if(bucket.isBlank()||accessKey.isBlank()||secretKey.isBlank()||publicBaseUrl.isBlank())throw new IllegalStateException("S3 requiere bucket, credenciales y STORAGE_PUBLIC_URL");var builder=S3Client.builder().region(Region.of(region)).credentialsProvider(StaticCredentialsProvider.create(AwsBasicCredentials.create(accessKey,secretKey)));if(!endpoint.isBlank())builder.endpointOverride(URI.create(endpoint)).serviceConfiguration(S3Configuration.builder().pathStyleAccessEnabled(true).build());client=builder.build();}
  public String store(MultipartFile file,String extension){String key="horses/"+UUID.randomUUID()+extension;try{client.putObject(PutObjectRequest.builder().bucket(bucket).key(key).contentType(file.getContentType()).build(),RequestBody.fromInputStream(file.getInputStream(),file.getSize()));return publicBaseUrl.replaceAll("/$","")+"/"+key;}catch(Exception e){throw new BusinessException("No se pudo guardar la imagen en la nube");}}
}
