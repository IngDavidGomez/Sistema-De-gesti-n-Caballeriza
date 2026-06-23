package com.establo.service;

import com.establo.dto.SupplyRecordDto;
import com.establo.entity.InventoryItem;
import com.establo.repository.*;
import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;
import java.util.Optional;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class SupplyRecordServiceTest {
  @Test void outputMovementDecreasesInventory() {
    var records=mock(SupplyRecordRepository.class);var inventory=mock(InventoryItemRepository.class);
    var item=InventoryItem.builder().id(1L).name("Heno").category("Alimento").quantity(20d).minimumStock(5d).unit("kg").build();
    when(inventory.findByIdForUpdate(1L)).thenReturn(Optional.of(item));
    when(records.save(any())).thenAnswer(i->{var r=i.getArgument(0,com.establo.entity.SupplyRecord.class);r.setId(1L);return r;});
    var service=new SupplyRecordService(records,inventory);
    service.create(new SupplyRecordDto(null,1L,null,LocalDateTime.now(),"OUT",4d,"Ana",null,null));
    assertThat(item.getQuantity()).isEqualTo(16d);
    verify(inventory).save(item);
  }
}
