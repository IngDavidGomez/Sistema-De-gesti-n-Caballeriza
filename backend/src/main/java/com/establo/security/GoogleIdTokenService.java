package com.establo.security;

import com.establo.exception.BusinessException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.oauth2.core.*;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GoogleIdTokenService {
  private static final String ISSUER = "https://accounts.google.com";
  private final String clientId;
  private volatile JwtDecoder decoder;

  public GoogleIdTokenService(@Value("${app.google.client-id:}") String clientId) {
    this.clientId = clientId;
  }

  public GoogleProfile verify(String credential) {
    if (clientId == null || clientId.isBlank())
      throw new BusinessException("El acceso con Google no está configurado");
    try {
      Jwt token = decoder().decode(credential);
      Boolean emailVerified = token.getClaim("email_verified");
      String email = token.getClaimAsString("email");
      String name = token.getClaimAsString("name");
      if (!Boolean.TRUE.equals(emailVerified) || email == null || email.isBlank()
          || token.getSubject() == null || token.getSubject().isBlank())
        throw new BadCredentialsException("La cuenta de Google no tiene un correo verificado");
      return new GoogleProfile(token.getSubject(), email, name == null || name.isBlank() ? email : name);
    } catch (JwtException exception) {
      throw new BadCredentialsException("Token de Google inválido", exception);
    }
  }

  private JwtDecoder decoder() {
    if (decoder == null) {
      synchronized (this) {
        if (decoder == null) {
          NimbusJwtDecoder candidate = NimbusJwtDecoder.withIssuerLocation(ISSUER).build();
          OAuth2TokenValidator<Jwt> issuer = JwtValidators.createDefaultWithIssuer(ISSUER);
          OAuth2TokenValidator<Jwt> audience = token -> token.getAudience().contains(clientId)
              ? OAuth2TokenValidatorResult.success()
              : OAuth2TokenValidatorResult.failure(new OAuth2Error("invalid_token", "Audiencia de Google inválida", null));
          candidate.setJwtValidator(new DelegatingOAuth2TokenValidator<>(issuer, audience));
          decoder = candidate;
        }
      }
    }
    return decoder;
  }

  public record GoogleProfile(String subject, String email, String name) {}
}
