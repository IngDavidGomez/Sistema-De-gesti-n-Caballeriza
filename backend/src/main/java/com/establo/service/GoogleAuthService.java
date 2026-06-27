package com.establo.service;

import com.establo.dto.AuthDto;
import com.establo.entity.*;
import com.establo.repository.UserRepository;
import com.establo.security.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service @RequiredArgsConstructor
public class GoogleAuthService {
  private final UserRepository users;
  private final PasswordEncoder encoder;
  private final JwtService jwt;
  private final GoogleIdTokenService googleTokens;

  @Transactional
  public AuthDto.Response login(String credential) {
    var profile = googleTokens.verify(credential);
    User user = users.findByGoogleSubject(profile.subject()).orElseGet(() -> linkOrCreate(profile));
    if (!user.isActive()) throw new BadCredentialsException("La cuenta está inactiva");
    return new AuthDto.Response(jwt.generate(user),user.getId(),user.getName(),user.getEmail(),user.getRole());
  }

  private User linkOrCreate(GoogleIdTokenService.GoogleProfile profile) {
    return users.findByEmailIgnoreCase(profile.email()).map(existing -> {
      if (existing.getGoogleSubject() != null && !existing.getGoogleSubject().equals(profile.subject()))
        throw new BadCredentialsException("La cuenta ya está vinculada a otra identidad de Google");
      existing.setGoogleSubject(profile.subject());
      return users.save(existing);
    }).orElseGet(() -> users.save(User.builder()
        .name(profile.name()).email(profile.email().toLowerCase())
        .password(encoder.encode(UUID.randomUUID().toString()))
        .googleSubject(profile.subject()).role(Role.CLIENT).active(true).build()));
  }
}
