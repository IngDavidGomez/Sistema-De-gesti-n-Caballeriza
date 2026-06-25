package com.establo.security;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;
import org.springframework.http.HttpMethod;
import java.util.*;

@Configuration @EnableMethodSecurity @RequiredArgsConstructor
public class SecurityConfig {
  private final JwtAuthenticationFilter jwtFilter;
  private final AuditFilter auditFilter;
  @Value("${app.cors.allowed-origins:http://localhost:5173,http://127.0.0.1:5173}") private String allowedOrigins;

  @Bean PasswordEncoder passwordEncoder(){return new BCryptPasswordEncoder();}
  @Bean AuthenticationManager authenticationManager(AuthenticationConfiguration configuration)throws Exception{return configuration.getAuthenticationManager();}
  @Bean SecurityFilterChain chain(HttpSecurity http)throws Exception{return http
    .csrf(csrf->csrf.disable()).cors(cors->cors.configurationSource(cors()))
    .sessionManagement(session->session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
    .authorizeHttpRequests(auth->auth.requestMatchers(HttpMethod.GET,"/api/horses/*/photo").permitAll().requestMatchers("/","/api/auth/**","/swagger-ui/**","/swagger-ui.html","/v3/api-docs/**","/h2-console/**","/uploads/**","/demo-horses/**","/actuator/health","/actuator/health/**").permitAll().anyRequest().authenticated())
    .headers(headers->headers.frameOptions(frame->frame.sameOrigin()))
    .addFilterBefore(jwtFilter,UsernamePasswordAuthenticationFilter.class)
    .addFilterAfter(auditFilter,JwtAuthenticationFilter.class).build();}

  @Bean CorsConfigurationSource cors(){var config=new CorsConfiguration();config.setAllowedOrigins(Arrays.stream(allowedOrigins.split(",")).map(String::trim).filter(value->!value.isBlank()).toList());config.setAllowedMethods(List.of("GET","POST","PUT","PATCH","DELETE","OPTIONS"));config.setAllowedHeaders(List.of("*"));var source=new UrlBasedCorsConfigurationSource();source.registerCorsConfiguration("/**",config);return source;}
}
