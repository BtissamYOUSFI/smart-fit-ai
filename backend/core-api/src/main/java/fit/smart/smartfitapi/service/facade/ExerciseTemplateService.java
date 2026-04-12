package fit.smart.smartfitapi.service.facade;

import fit.smart.smartfitapi.entity.ExerciseTemplate;

import java.util.List;

public interface ExerciseTemplateService {

    List<ExerciseTemplate> findAll();
    ExerciseTemplate findById(Long id);
    ExerciseTemplate save(ExerciseTemplate exerciseTemplate);
    int deleteById(Long id);

}
