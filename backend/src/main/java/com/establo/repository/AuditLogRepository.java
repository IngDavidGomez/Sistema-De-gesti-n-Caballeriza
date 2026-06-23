package com.establo.repository;

import com.establo.entity.AuditLog;
import org.springframework.data.jpa.repository.*;

public interface AuditLogRepository extends JpaRepository<AuditLog,Long>,JpaSpecificationExecutor<AuditLog> {}
