package fit.smart.smartfitapi.repository;

import fit.smart.smartfitapi.entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {
    int deleteSessionById(long id);
}
