package fit.smart.smartfitapi.service.impl;

import fit.smart.smartfitapi.entity.ExerciseRep;
import fit.smart.smartfitapi.repository.ExerciseRepRepository;
import fit.smart.smartfitapi.service.facade.ExerciseRepService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ExerciseRepServiceImpl implements ExerciseRepService {

    private final ExerciseRepRepository repo;

    @Override
    public ExerciseRep save(ExerciseRep rep) {
        return repo.save(rep);
    }

    @Override
    public ExerciseRep findById(Long id) {
        return repo.findById(id).orElse(null);
    }

    @Override
    public List<ExerciseRep> findByExerciseId(Long exerciseId) {
        return repo.findByExerciseId(exerciseId);
    }

    @Override
    public int deleteById(Long id) {
        return repo.deleteExerciseRepById(id);
    }
}
