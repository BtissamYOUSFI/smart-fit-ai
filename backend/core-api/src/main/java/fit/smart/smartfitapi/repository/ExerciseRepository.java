package fit.smart.smartfitapi.repository;

import fit.smart.smartfitapi.entity.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, Long> {
    int deleteExerciseById(long id);
    List<Exercise> findBySessionId(long sessionId);
}
