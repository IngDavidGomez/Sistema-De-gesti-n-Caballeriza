package com.establo.repository;
import com.establo.entity.FeedingPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface FeedingPlanRepository extends JpaRepository<FeedingPlan,Long> { List<FeedingPlan> findByHorseId(Long horseId); }
