package com.establo.controller;
import com.establo.dto.AuthDto;import com.establo.service.*;import io.swagger.v3.oas.annotations.Operation;import io.swagger.v3.oas.annotations.responses.ApiResponse;import jakarta.validation.Valid;import lombok.RequiredArgsConstructor;import org.springframework.http.*;import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/auth") @RequiredArgsConstructor
public class AuthController{
  private final AuthService service;private final PasswordResetService passwords;
  @Operation(summary="Iniciar sesión",description="Valida credenciales y devuelve un JWT con la identidad y el rol del usuario.") @ApiResponse(responseCode="200",description="Autenticación correcta") @ApiResponse(responseCode="401",description="Credenciales inválidas")
  @PostMapping("/login") AuthDto.Response login(@Valid @RequestBody AuthDto.Login d){return service.login(d);}
  @Operation(summary="Registrar cliente",description="Crea una cuenta con rol CLIENT. El registro público nunca acepta roles privilegiados.") @ApiResponse(responseCode="201",description="Cuenta creada") @ApiResponse(responseCode="400",description="Datos inválidos o correo duplicado")
  @PostMapping("/register") ResponseEntity<AuthDto.Response> register(@Valid @RequestBody AuthDto.Register d){return ResponseEntity.status(HttpStatus.CREATED).body(service.register(d));}
  @Operation(summary="Solicitar recuperación",description="Siempre devuelve el mismo mensaje para impedir la enumeración de usuarios. El enlace vence en 30 minutos.")
  @PostMapping("/forgot-password") AuthDto.Message forgot(@Valid @RequestBody AuthDto.ForgotPassword d){passwords.request(d.email());return new AuthDto.Message("Si el correo está registrado, recibirá instrucciones para restablecer su contraseña");}
  @Operation(summary="Restablecer contraseña",description="Consume una sola vez el token recibido por correo y actualiza la contraseña cifrada.") @ApiResponse(responseCode="400",description="Token inválido, vencido o utilizado")
  @PostMapping("/reset-password") AuthDto.Message reset(@Valid @RequestBody AuthDto.ResetPassword d){passwords.reset(d.token(),d.password());return new AuthDto.Message("Contraseña actualizada correctamente");}
}
