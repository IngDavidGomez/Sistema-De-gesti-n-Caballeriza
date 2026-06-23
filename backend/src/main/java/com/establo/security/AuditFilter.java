package com.establo.security;

import com.establo.service.AuditService;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

@Component @RequiredArgsConstructor
public class AuditFilter extends OncePerRequestFilter {
  private final AuditService audit;

  @Override protected void doFilterInternal(HttpServletRequest request,HttpServletResponse response,FilterChain chain)throws ServletException,IOException{
    try{chain.doFilter(request,response);}finally{
      var authentication=SecurityContextHolder.getContext().getAuthentication();
      if(authentication!=null&&authentication.isAuthenticated()&&!(authentication instanceof AnonymousAuthenticationToken)&&shouldAudit(request)){
        var role=authentication.getAuthorities().stream().findFirst().map(a->a.getAuthority().replace("ROLE_","")).orElse("UNKNOWN");
        try{audit.record(authentication.getName(),role,action(request),resource(request.getRequestURI()),request.getMethod(),request.getRequestURI(),description(request),response.getStatus(),clientIp(request),request.getHeader("User-Agent"));}catch(Exception ignored){}
      }
    }
  }

  private boolean shouldAudit(HttpServletRequest request){
    var method=request.getMethod();var path=request.getRequestURI();
    if(path.startsWith("/api/auth/"))return false;
    return switch(method){case "POST","PUT","PATCH","DELETE"->path.startsWith("/api/");case "GET"->path.startsWith("/api/reports/")||path.equals("/api/audit/pdf");default->false;};
  }

  private String action(HttpServletRequest request){
    var method=request.getMethod();var path=request.getRequestURI();
    if(method.equals("GET"))return "GENERAR_REPORTE";
    if(path.endsWith("/cancel"))return "CANCELAR";
    if(path.endsWith("/status"))return "CAMBIAR_ESTADO";
    if(path.endsWith("/role"))return "CAMBIAR_ROL";
    if(path.endsWith("/read")||path.endsWith("/read-all"))return "MARCAR_LEIDO";
    return switch(method){case "POST"->"CREAR";case "PUT"->"ACTUALIZAR";case "PATCH"->"MODIFICAR";case "DELETE"->"ELIMINAR";default->"CONSULTAR";};
  }

  private String resource(String path){
    if(path.contains("/horses"))return "Caballos";
    if(path.contains("/medical-records"))return "Historial médico";
    if(path.contains("/reservations"))return "Agenda";
    if(path.contains("/feeding-plans"))return "Alimentación";
    if(path.contains("/inventory"))return "Inventario";
    if(path.contains("/supply-records"))return "Suministros";
    if(path.contains("/employees"))return "Personal";
    if(path.contains("/users"))return "Usuarios y roles";
    if(path.contains("/notifications"))return "Notificaciones";
    if(path.contains("/reports"))return "Reportes";
    if(path.contains("/audit"))return "Auditoría";
    return "Sistema";
  }

  private String description(HttpServletRequest request){return actionLabel(action(request))+" en "+resource(request.getRequestURI());}
  private String actionLabel(String action){return switch(action){case "CREAR"->"Crear";case "ACTUALIZAR"->"Actualizar";case "ELIMINAR"->"Eliminar";case "MODIFICAR"->"Modificar";case "CANCELAR"->"Cancelar";case "CAMBIAR_ESTADO"->"Cambiar estado";case "CAMBIAR_ROL"->"Cambiar rol";case "MARCAR_LEIDO"->"Marcar leído";case "GENERAR_REPORTE"->"Generar reporte";default->action;};}
  private String clientIp(HttpServletRequest request){var forwarded=request.getHeader("X-Forwarded-For");return forwarded==null||forwarded.isBlank()?request.getRemoteAddr():forwarded.split(",")[0].trim();}
}
