package com.establo.repository;
import com.establo.entity.InventoryItem;
import org.springframework.data.jpa.repository.*;import jakarta.persistence.LockModeType;import java.util.Optional;
public interface InventoryItemRepository extends JpaRepository<InventoryItem,Long> {@Lock(LockModeType.PESSIMISTIC_WRITE)@Query("select i from InventoryItem i where i.id=:id")Optional<InventoryItem> findByIdForUpdate(Long id);}
