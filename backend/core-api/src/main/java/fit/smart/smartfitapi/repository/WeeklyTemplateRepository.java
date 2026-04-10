package fit.smart.smartfitapi.repository;

import fit.smart.smartfitapi.entity.WeeklyTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WeeklyTemplateRepository extends JpaRepository<WeeklyTemplate, Integer> {
}
