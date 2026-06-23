package com.establo.repository;
import com.establo.entity.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface MedicalRecordRepository extends JpaRepository<MedicalRecord,Long> { List<MedicalRecord> findByHorseIdOrderByDateDesc(Long horseId); }
