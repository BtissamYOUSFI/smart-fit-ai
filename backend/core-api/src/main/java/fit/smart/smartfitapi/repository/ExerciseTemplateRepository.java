package fit.smart.smartfitapi.repository;

import fit.smart.smartfitapi.entity.ExerciseTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExerciseTemplateRepository extends JpaRepository<ExerciseTemplate, Long> {
    int deleteExerciseTemplateById(long id);
}
