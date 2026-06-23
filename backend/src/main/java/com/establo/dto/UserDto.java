package com.establo.dto;
import com.establo.entity.Role;
import jakarta.validation.constraints.NotNull;
public record UserDto(Long id,String name,String email,Role role,boolean active) { public record RoleUpdate(@NotNull Role role){} public record StatusUpdate(boolean active){} }
