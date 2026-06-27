package com.establo.dto;
import com.establo.entity.Role;
import jakarta.validation.constraints.*;
public final class AuthDto {
  private AuthDto() {}
  public record Login(@Email @NotBlank String email,@NotBlank String password) {}
  public record Register(@NotBlank String name,@Email @NotBlank String email,@Size(min=8) String password) {}
  public record GoogleLogin(@NotBlank String credential) {}
  public record ForgotPassword(@Email @NotBlank String email) {}
  public record ResetPassword(@NotBlank String token,@Size(min=8,max=128) String password) {}
  public record Message(String message) {}
  public record Response(String token,Long id,String name,String email,Role role) {}
}
