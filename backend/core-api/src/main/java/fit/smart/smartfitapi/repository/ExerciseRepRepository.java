package fit.smart.smartfitapi.repository;

import fit.smart.smartfitapi.entity.ExerciseRep;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExerciseRepRepository extends JpaRepository<ExerciseRep, Long> {
    List<ExerciseRep> findByExerciseId(Long exerciseId);
    int deleteExerciseRepById(long id);
}
