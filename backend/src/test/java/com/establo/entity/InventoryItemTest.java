package com.establo.entity;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

class InventoryItemTest {
  @Test void reportsLowStockAtConfiguredMinimum() {
    var item = InventoryItem.builder().name("Heno").category("Alimento").quantity(10d).minimumStock(10d).unit("kg").build();
    assertThat(item.isLowStock()).isTrue();
  }

  @Test void reportsAvailableStockAboveMinimum() {
    var item = InventoryItem.builder().name("Heno").category("Alimento").quantity(11d).minimumStock(10d).unit("kg").build();
    assertThat(item.isLowStock()).isFalse();
  }
}
