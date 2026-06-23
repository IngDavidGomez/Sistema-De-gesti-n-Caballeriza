package com.establo.repository;
import com.establo.entity.Horse;
import org.springframework.data.jpa.repository.JpaRepository;
public interface HorseRepository extends JpaRepository<Horse,Long> { boolean existsByCodeIgnoreCase(String code); }
