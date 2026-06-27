package com.establo.repository;
import com.establo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import com.establo.entity.Role;
public interface UserRepository extends JpaRepository<User,Long> { Optional<User> findByEmailIgnoreCase(String email); Optional<User> findByGoogleSubject(String googleSubject); boolean existsByEmailIgnoreCase(String email); long countByRole(Role role); }
