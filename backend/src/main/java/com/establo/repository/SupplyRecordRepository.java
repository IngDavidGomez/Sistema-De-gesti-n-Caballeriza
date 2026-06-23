package com.establo.repository;
import com.establo.entity.SupplyRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface SupplyRecordRepository extends JpaRepository<SupplyRecord,Long> { List<SupplyRecord> findAllByOrderByDateDesc(); }
