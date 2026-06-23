package com.establo.repository;
import com.establo.entity.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken,Long>{Optional<PasswordResetToken> findByTokenHash(String tokenHash);List<PasswordResetToken> findByUserAndUsedAtIsNull(com.establo.entity.User user);}
