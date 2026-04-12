package fit.smart.smartfitapi.repository;

import fit.smart.smartfitapi.entity.WeeklyTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WeeklyTemplateRepository extends JpaRepository<WeeklyTemplate, Long> {
    WeeklyTemplate findByLabel(String label);
    int deleteById(long id);
    List<WeeklyTemplate> findByTrainingProgramTitle(String title);
    WeeklyTemplate findById(long id);
    int deleteByTrainingProgramTitle(String title);
}
