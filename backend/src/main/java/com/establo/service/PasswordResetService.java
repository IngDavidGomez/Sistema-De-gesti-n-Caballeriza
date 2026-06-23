package com.establo.service;
import com.establo.entity.PasswordResetToken;
import com.establo.exception.BusinessException;
import com.establo.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.nio.charset.StandardCharsets;
import java.security.*;
import java.time.LocalDateTime;
import java.util.Base64;

@Service @RequiredArgsConstructor
public class PasswordResetService {
  private final UserRepository users; private final PasswordResetTokenRepository tokens; private final PasswordEncoder encoder; private final EmailService email;
  @Value("${app.frontend-url:http://localhost:5173}") private String frontendUrl;
  private final SecureRandom random=new SecureRandom();
  @Transactional public void request(String address){users.findByEmailIgnoreCase(address).filter(u->u.isActive()).ifPresent(u->{var now=LocalDateTime.now();tokens.findByUserAndUsedAtIsNull(u).forEach(t->{t.setUsedAt(now);tokens.save(t);});byte[] bytes=new byte[32];random.nextBytes(bytes);String raw=Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);tokens.save(PasswordResetToken.builder().user(u).tokenHash(hash(raw)).createdAt(now).expiresAt(now.plusMinutes(30)).build());email.sendPasswordReset(u.getEmail(),u.getName(),frontendUrl+"/restablecer-contrasena?token="+raw);});}
  @Transactional public void reset(String raw,String password){var token=tokens.findByTokenHash(hash(raw)).orElseThrow(()->new BusinessException("El enlace no es válido o ya venció"));if(!token.isValid(LocalDateTime.now()))throw new BusinessException("El enlace no es válido o ya venció");token.getUser().setPassword(encoder.encode(password));token.setUsedAt(LocalDateTime.now());tokens.save(token);users.save(token.getUser());}
  String hash(String value){try{var digest=MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8));return java.util.HexFormat.of().formatHex(digest);}catch(NoSuchAlgorithmException e){throw new IllegalStateException(e);}}
}
