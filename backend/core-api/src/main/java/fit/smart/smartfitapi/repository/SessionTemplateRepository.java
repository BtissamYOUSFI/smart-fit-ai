package fit.smart.smartfitapi.repository;


import fit.smart.smartfitapi.entity.SessionTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SessionTemplateRepository extends JpaRepository<SessionTemplate, Long> {
    int deleteSessionById(long id);
}