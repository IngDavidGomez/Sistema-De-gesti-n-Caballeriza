package com.establo.service;
import com.establo.dto.AuthDto;import com.establo.entity.*;import com.establo.exception.BusinessException;import com.establo.repository.UserRepository;import com.establo.security.JwtService;import lombok.RequiredArgsConstructor;import org.springframework.security.authentication.*;import org.springframework.security.crypto.password.PasswordEncoder;import org.springframework.stereotype.Service;
@Service @RequiredArgsConstructor public class AuthService {
 private final UserRepository users;private final PasswordEncoder encoder;private final JwtService jwt;private final AuthenticationManager auth;
 public AuthDto.Response register(AuthDto.Register d){if(users.existsByEmailIgnoreCase(d.email()))throw new BusinessException("El correo ya está registrado");var u=users.save(User.builder().name(d.name()).email(d.email().toLowerCase()).password(encoder.encode(d.password())).role(Role.CLIENT).build());return response(u);}
 public AuthDto.Response login(AuthDto.Login d){auth.authenticate(new UsernamePasswordAuthenticationToken(d.email(),d.password()));return response(users.findByEmailIgnoreCase(d.email()).orElseThrow());}
 private AuthDto.Response response(User u){return new AuthDto.Response(jwt.generate(u),u.getId(),u.getName(),u.getEmail(),u.getRole());}
}
