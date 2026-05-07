package fit.smart.smartfitapi.service.facade;

import fit.smart.smartfitapi.entity.ExerciseRep;

import java.util.List;

public interface ExerciseRepService {
    ExerciseRep save(ExerciseRep rep);
    ExerciseRep findById(Long id);
    List<ExerciseRep> findByExerciseId(Long exerciseId);
    int deleteById(Long id);
}
