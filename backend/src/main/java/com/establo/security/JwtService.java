package com.establo.security;
import com.establo.entity.User;import io.jsonwebtoken.*;import io.jsonwebtoken.security.Keys;import org.springframework.beans.factory.annotation.Value;import org.springframework.stereotype.Service;import javax.crypto.SecretKey;import java.nio.charset.StandardCharsets;import java.util.Date;
@Service public class JwtService {
 @Value("${app.jwt.secret}") private String secret;@Value("${app.jwt.expiration}") private long expiration;
 private SecretKey key(){return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));}
 public String generate(User u){return Jwts.builder().subject(u.getEmail()).claim("role",u.getRole().name()).issuedAt(new Date()).expiration(new Date(System.currentTimeMillis()+expiration)).signWith(key()).compact();}
 public String username(String token){return Jwts.parser().verifyWith(key()).build().parseSignedClaims(token).getPayload().getSubject();}
 public boolean valid(String token){try{Jwts.parser().verifyWith(key()).build().parseSignedClaims(token);return true;}catch(JwtException|IllegalArgumentException e){return false;}}
}
