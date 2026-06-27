package com.establo.service;

import com.establo.entity.*;
import com.establo.repository.UserRepository;
import com.establo.security.*;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Optional;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class GoogleAuthServiceTest {
  UserRepository users=mock(UserRepository.class); PasswordEncoder encoder=mock(PasswordEncoder.class);
  JwtService jwt=mock(JwtService.class); GoogleIdTokenService tokens=mock(GoogleIdTokenService.class);
  GoogleAuthService service=new GoogleAuthService(users,encoder,jwt,tokens);

  @Test void createsNewGoogleUserAsClient() {
    var profile=new GoogleIdTokenService.GoogleProfile("google-123","ANA@TEST.COM","Ana");
    when(tokens.verify("credential")).thenReturn(profile); when(users.findByGoogleSubject("google-123")).thenReturn(Optional.empty());
    when(users.findByEmailIgnoreCase("ANA@TEST.COM")).thenReturn(Optional.empty()); when(encoder.encode(any())).thenReturn("random-hash");
    when(users.save(any())).thenAnswer(i->{var user=(User)i.getArgument(0);user.setId(9L);return user;}); when(jwt.generate(any())).thenReturn("jwt");
    var response=service.login("credential");
    var captor=org.mockito.ArgumentCaptor.forClass(User.class); verify(users).save(captor.capture());
    assertThat(captor.getValue().getGoogleSubject()).isEqualTo("google-123");
    assertThat(captor.getValue().getEmail()).isEqualTo("ana@test.com");
    assertThat(captor.getValue().getRole()).isEqualTo(Role.CLIENT); assertThat(response.token()).isEqualTo("jwt");
  }

  @Test void linksExistingAccountWithoutChangingItsRole() {
    var existing=User.builder().id(2L).name("Ana").email("ana@test.com").password("hash").role(Role.VETERINARIAN).active(true).build();
    when(tokens.verify("credential")).thenReturn(new GoogleIdTokenService.GoogleProfile("google-123","ana@test.com","Ana"));
    when(users.findByGoogleSubject("google-123")).thenReturn(Optional.empty()); when(users.findByEmailIgnoreCase("ana@test.com")).thenReturn(Optional.of(existing));
    when(users.save(existing)).thenReturn(existing); when(jwt.generate(existing)).thenReturn("jwt");
    var response=service.login("credential");
    assertThat(existing.getGoogleSubject()).isEqualTo("google-123"); assertThat(response.role()).isEqualTo(Role.VETERINARIAN);
  }

  @Test void rejectsInactiveAccount() {
    var existing=User.builder().id(2L).name("Ana").email("ana@test.com").password("hash").googleSubject("google-123").role(Role.CLIENT).active(false).build();
    when(tokens.verify("credential")).thenReturn(new GoogleIdTokenService.GoogleProfile("google-123","ana@test.com","Ana"));
    when(users.findByGoogleSubject("google-123")).thenReturn(Optional.of(existing));
    assertThatThrownBy(()->service.login("credential")).isInstanceOf(BadCredentialsException.class);
  }
}
