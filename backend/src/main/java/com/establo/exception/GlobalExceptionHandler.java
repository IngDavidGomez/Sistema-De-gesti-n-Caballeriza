package com.establo.exception;

import org.springframework.http.*;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.dao.*;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {
  @ExceptionHandler(ResourceNotFoundException.class)
  ResponseEntity<ApiError> notFound(ResourceNotFoundException ex) { return build(HttpStatus.NOT_FOUND,ex.getMessage(),Map.of()); }
  @ExceptionHandler(BusinessException.class)
  ResponseEntity<ApiError> business(BusinessException ex) { return build(HttpStatus.CONFLICT,ex.getMessage(),Map.of()); }
  @ExceptionHandler(AuthenticationException.class)
  ResponseEntity<ApiError> unauthorized(AuthenticationException ex) { return build(HttpStatus.UNAUTHORIZED,"Credenciales incorrectas",Map.of()); }
  @ExceptionHandler(AccessDeniedException.class)
  ResponseEntity<ApiError> forbidden(AccessDeniedException ex) { return build(HttpStatus.FORBIDDEN,"No tiene permisos para realizar esta acción",Map.of()); }
  @ExceptionHandler(MethodArgumentNotValidException.class)
  ResponseEntity<ApiError> validation(MethodArgumentNotValidException ex) {
    var errors=ex.getBindingResult().getFieldErrors().stream().collect(Collectors.toMap(e->e.getField(),e->Optional.ofNullable(e.getDefaultMessage()).orElse("Inválido"),(a,b)->a));
    return build(HttpStatus.BAD_REQUEST,"Datos inválidos",errors);
  }
  @ExceptionHandler(HttpMessageNotReadableException.class)
  ResponseEntity<ApiError> malformedJson(HttpMessageNotReadableException ex) { return build(HttpStatus.BAD_REQUEST,"Solicitud JSON inválida",Map.of()); }
  @ExceptionHandler(MaxUploadSizeExceededException.class)
  ResponseEntity<ApiError> fileTooLarge(MaxUploadSizeExceededException ex) { return build(HttpStatus.PAYLOAD_TOO_LARGE,"La imagen no puede superar 5 MB",Map.of()); }
  @ExceptionHandler(DataIntegrityViolationException.class)
  ResponseEntity<ApiError> integrity(DataIntegrityViolationException ex) {String detail=Optional.ofNullable(ex.getMostSpecificCause()).map(Throwable::getMessage).orElse("");String message=detail.contains("reservation_no_overlap")?"El caballo ya tiene una reserva en ese horario":detail.contains("administrador activo")?"Debe existir al menos un administrador activo":"La operación incumple una regla de integridad de datos";return build(HttpStatus.CONFLICT,message,Map.of());}
  @ExceptionHandler({ObjectOptimisticLockingFailureException.class,PessimisticLockingFailureException.class})
  ResponseEntity<ApiError> concurrency(Exception ex){return build(HttpStatus.CONFLICT,"El registro fue modificado por otra operación; actualice los datos e intente nuevamente",Map.of());}
  @ExceptionHandler(Exception.class)
  ResponseEntity<ApiError> general(Exception ex) { return build(HttpStatus.INTERNAL_SERVER_ERROR,"Error interno del servidor",Map.of()); }
  private ResponseEntity<ApiError> build(HttpStatus s,String m,Map<String,String> e){return ResponseEntity.status(s).body(new ApiError(Instant.now(),s.value(),m,e));}
}
