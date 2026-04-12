package fit.smart.smartfitapi.service.facade;

import fit.smart.smartfitapi.entity.Exercise;

import java.util.List;

public interface ExerciseService {

    List<Exercise> findAll();
    Exercise findById(Long id);

    List<Exercise> findBySessionId(long sessionId);

    Exercise save(Exercise exercise);
    int deleteById(Long id);

}
