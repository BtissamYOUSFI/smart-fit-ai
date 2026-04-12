package fit.smart.smartfitapi.service.impl;

import fit.smart.smartfitapi.entity.ExerciseTemplate;
import fit.smart.smartfitapi.repository.ExerciseTemplateRepository;
import fit.smart.smartfitapi.service.facade.ExerciseTemplateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExerciseTemplateServiceImpl implements ExerciseTemplateService {

    @Override
    public List<ExerciseTemplate> findAll() {
        return repo.findAll();
    }

    @Override
    public ExerciseTemplate findById(Long id) {
        return repo.findById(id).orElse(null);
    }

    @Override
    public ExerciseTemplate save(ExerciseTemplate exerciseTemplate) {
        return repo.save(exerciseTemplate);
    }

    @Override
    public int deleteById(Long id) {
        return repo.deleteExerciseTemplateById(id);
    }

    @Autowired
    private ExerciseTemplateRepository repo;
}
