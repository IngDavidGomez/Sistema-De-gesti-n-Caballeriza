package com.establo.service;

import com.establo.dto.AuditDto;
import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import org.springframework.stereotype.Service;
import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class AuditPdfService {
  private static final Color NAVY=new Color(24,39,58),BLUE=new Color(73,113,148),GOLD=new Color(193,126,72),SOFT=new Color(244,247,249),LINE=new Color(216,225,232),GREEN=new Color(55,121,88),RED=new Color(176,68,68),MUTED=new Color(102,118,132);
  private static final Font TITLE=FontFactory.getFont(FontFactory.HELVETICA_BOLD,22,NAVY),SUBTITLE=FontFactory.getFont(FontFactory.HELVETICA,9,MUTED),BODY=FontFactory.getFont(FontFactory.HELVETICA,8,NAVY),BOLD=FontFactory.getFont(FontFactory.HELVETICA_BOLD,8,NAVY),WHITE=FontFactory.getFont(FontFactory.HELVETICA_BOLD,8,Color.WHITE);

  public byte[] generate(java.util.List<AuditDto> rows,LocalDate from,LocalDate to){
    try(var output=new ByteArrayOutputStream()){
      var document=new Document(PageSize.A4.rotate(),32,32,50,40);var writer=PdfWriter.getInstance(document,output);writer.setPageEvent(new PageBrand(from,to));
      document.addTitle("Auditoría del sistema - Establo Horizonte");document.addAuthor("Establo Horizonte");document.open();
      document.add(new Paragraph("CONTROL Y TRAZABILIDAD  /  AUDITORÍA DEL SISTEMA",FontFactory.getFont(FontFactory.HELVETICA_BOLD,8,GOLD)));
      var title=new Paragraph("Auditoría del sistema",TITLE);title.setSpacingBefore(6);document.add(title);
      var range=new Paragraph("Registro de actividad del "+date(from)+" al "+date(to)+"  ·  Generado "+LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")),SUBTITLE);range.setSpacingAfter(16);document.add(range);
      long successful=rows.stream().filter(AuditDto::success).count(),failed=rows.size()-successful,users=rows.stream().map(AuditDto::username).distinct().count();
      var summary=new PdfPTable(new float[]{2,1,2,1,2,1});summary.setWidthPercentage(100);summary.setSpacingAfter(16);
      addSummary(summary,"Eventos",Long.toString(rows.size()),BLUE);addSummary(summary,"Usuarios",Long.toString(users),BLUE);addSummary(summary,"Correctos / fallidos",successful+" / "+failed,failed>0?RED:GREEN);document.add(summary);
      var table=new PdfPTable(new float[]{1.35f,1.45f,.85f,1.15f,1.15f,2.2f,.65f,.9f});table.setWidthPercentage(100);table.setHeaderRows(1);table.setSplitLate(false);
      for(String header:new String[]{"Fecha","Usuario","Rol","Acción","Módulo","Detalle","Resultado","IP"})table.addCell(cell(header,WHITE,NAVY));
      if(rows.isEmpty()){var empty=cell("No existen eventos para los filtros seleccionados",SUBTITLE,SOFT);empty.setColspan(8);empty.setHorizontalAlignment(Element.ALIGN_CENTER);empty.setPadding(14);table.addCell(empty);}else{int index=0;for(var row:rows){var bg=index++%2==0?Color.WHITE:SOFT;table.addCell(cell(row.occurredAt().format(DateTimeFormatter.ofPattern("dd/MM/yy HH:mm:ss")),BODY,bg));table.addCell(cell(row.username(),BOLD,bg));table.addCell(cell(role(row.role()),BODY,bg));table.addCell(cell(action(row.action()),BODY,bg));table.addCell(cell(row.resource(),BODY,bg));table.addCell(cell(row.details(),BODY,bg));table.addCell(cell(row.success()?"Correcto":"Fallido",FontFactory.getFont(FontFactory.HELVETICA_BOLD,8,row.success()?GREEN:RED),bg));table.addCell(cell(row.ipAddress(),BODY,bg));}}
      document.add(table);var note=new Paragraph("Documento de control interno. Los registros deben conservarse según la política de seguridad y retención de datos de la organización.",SUBTITLE);note.setSpacingBefore(12);document.add(note);
      document.close();return output.toByteArray();
    }catch(Exception error){throw new IllegalStateException("No se pudo generar el reporte de auditoría",error);}
  }

  private void addSummary(PdfPTable table,String label,String value,Color valueColor){var labelCell=cell(label,BOLD,SOFT);labelCell.setPadding(9);table.addCell(labelCell);var valueCell=cell(value,FontFactory.getFont(FontFactory.HELVETICA_BOLD,13,valueColor),Color.WHITE);valueCell.setPadding(8);table.addCell(valueCell);}
  private PdfPCell cell(String value,Font font,Color background){var cell=new PdfPCell(new Phrase(value==null||value.isBlank()?"—":value,font));cell.setBackgroundColor(background);cell.setBorderColor(LINE);cell.setPadding(6);cell.setVerticalAlignment(Element.ALIGN_MIDDLE);return cell;}
  private String date(LocalDate value){return value==null?"inicio":value.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));}
  private String action(String value){return Map.of("CREAR","Crear","ACTUALIZAR","Actualizar","ELIMINAR","Eliminar","MODIFICAR","Modificar","CANCELAR","Cancelar","CAMBIAR_ESTADO","Cambiar estado","CAMBIAR_ROL","Cambiar rol","MARCAR_LEIDO","Marcar leído","GENERAR_REPORTE","Generar reporte").getOrDefault(value,value);}
  private String role(String value){return Map.of("ADMIN","Administrador","CAREGIVER","Cuidador","VETERINARIAN","Veterinario","CLIENT","Cliente").getOrDefault(value,value);}
  private static class PageBrand extends PdfPageEventHelper {private final LocalDate from,to;PageBrand(LocalDate from,LocalDate to){this.from=from;this.to=to;}@Override public void onEndPage(PdfWriter writer,Document document){var canvas=writer.getDirectContent();canvas.setColorStroke(LINE);canvas.moveTo(document.left(),document.bottom()-10);canvas.lineTo(document.right(),document.bottom()-10);canvas.stroke();ColumnText.showTextAligned(canvas,Element.ALIGN_LEFT,new Phrase("EH  ·  ESTABLO HORIZONTE",FontFactory.getFont(FontFactory.HELVETICA_BOLD,7,GOLD)),document.left(),document.top()+20,0);ColumnText.showTextAligned(canvas,Element.ALIGN_RIGHT,new Phrase("Auditoría "+(from==null?"inicio":from)+" — "+(to==null?LocalDate.now():to),FontFactory.getFont(FontFactory.HELVETICA,7,MUTED)),document.right(),document.top()+20,0);ColumnText.showTextAligned(canvas,Element.ALIGN_LEFT,new Phrase("Documento de control interno",FontFactory.getFont(FontFactory.HELVETICA,7,MUTED)),document.left(),document.bottom()-24,0);ColumnText.showTextAligned(canvas,Element.ALIGN_RIGHT,new Phrase("Página "+writer.getPageNumber(),FontFactory.getFont(FontFactory.HELVETICA_BOLD,7,NAVY)),document.right(),document.bottom()-24,0);}}
}
