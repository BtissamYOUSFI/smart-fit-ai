package fit.smart.smartfitapi.service.impl;

import fit.smart.smartfitapi.entity.Exercise;
import fit.smart.smartfitapi.repository.ExerciseRepository;
import fit.smart.smartfitapi.service.facade.ExerciseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExerciseServiceImpl implements ExerciseService {

    @Override
    public List<Exercise> findAll() {
        return repo.findAll();
    }

    @Override
    public Exercise findById(Long id) {
        return repo.findById(id).orElse(null);
    }

    @Override
    public List<Exercise> findBySessionId(long sessionId) {
        return repo.findBySessionId(sessionId);
    }

    @Override
    public Exercise save(Exercise exercise) {
        return repo.save(exercise);
    }

    @Override
    public int deleteById(Long id) {
        return repo.deleteExerciseById(id);
    }

    @Autowired
    private ExerciseRepository repo;
}
