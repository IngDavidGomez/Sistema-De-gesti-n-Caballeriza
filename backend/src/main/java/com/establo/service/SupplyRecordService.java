package com.establo.service;

import com.establo.dto.SupplyRecordDto;
import com.establo.entity.SupplyRecord;
import com.establo.exception.*;
import com.establo.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service @RequiredArgsConstructor
public class SupplyRecordService {
  private final SupplyRecordRepository records;
  private final InventoryItemRepository inventory;
  public List<SupplyRecordDto> all(){return records.findAllByOrderByDateDesc().stream().map(this::dto).toList();}
  @Transactional public SupplyRecordDto create(SupplyRecordDto d){var item=inventory.findByIdForUpdate(d.itemId()).orElseThrow(()->new ResourceNotFoundException("Insumo no encontrado"));double result="IN".equals(d.type())?item.getQuantity()+d.quantity():item.getQuantity()-d.quantity();if(result<0)throw new BusinessException("No hay existencias suficientes para registrar la salida");item.setQuantity(result);inventory.save(item);var r=SupplyRecord.builder().item(item).date(d.date()).type(d.type()).quantity(d.quantity()).responsible(d.responsible()).notes(d.notes()).build();return dto(records.save(r));}
  @Transactional public void delete(Long id){var r=records.findById(id).orElseThrow(()->new ResourceNotFoundException("Movimiento no encontrado"));var item=inventory.findByIdForUpdate(r.getItem().getId()).orElseThrow(()->new ResourceNotFoundException("Insumo no encontrado"));double result="IN".equals(r.getType())?item.getQuantity()-r.getQuantity():item.getQuantity()+r.getQuantity();if(result<0)throw new BusinessException("No se puede revertir el movimiento porque produciría stock negativo");item.setQuantity(result);inventory.save(item);records.delete(r);}
  private SupplyRecordDto dto(SupplyRecord r){return new SupplyRecordDto(r.getId(),r.getItem().getId(),r.getItem().getName(),r.getDate(),r.getType(),r.getQuantity(),r.getResponsible(),r.getNotes(),r.getItem().getUnit());}
}
