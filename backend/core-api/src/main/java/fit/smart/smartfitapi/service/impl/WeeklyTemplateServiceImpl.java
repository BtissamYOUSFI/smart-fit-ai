package fit.smart.smartfitapi.service.impl;

import fit.smart.smartfitapi.entity.WeeklyTemplate;
import fit.smart.smartfitapi.repository.WeeklyTemplateRepository;
import fit.smart.smartfitapi.service.facade.TrainingProgramService;
import fit.smart.smartfitapi.service.facade.WeeklyTemplateService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@AllArgsConstructor
@Service
public class WeeklyTemplateServiceImpl implements WeeklyTemplateService {
    @Override
    public WeeklyTemplate findByLabel(String label) {
        return repository.findByLabel(label);
    }

    @Override
    @Transactional
    public int deleteById(long id) {
        if (repository.findById(id) == null) {
            return -1;
        }
        return repository.deleteById(id);
    }

    @Override
    public List<WeeklyTemplate> findByTrainingProgramTitle(String title) {
        if (trainingProgramService.findByTitle(title) == null) {
            return null;
        }
        return repository.findByTrainingProgramTitle(title);
    }

    @Override
    public List<WeeklyTemplate> findAll() {
        return repository.findAll();
    }

    @Override
    public WeeklyTemplate save(WeeklyTemplate weeklyTemplate) {
        if (this.findByLabel(weeklyTemplate.getLabel()) != null) {
            return null;
        }
        return repository.save(weeklyTemplate);
    }

    @Override
    public WeeklyTemplate update(WeeklyTemplate weeklyTemplate) {
        if (this.findByLabel(weeklyTemplate.getLabel()) == null) {
            return null;
        }
        return repository.save(weeklyTemplate);
    }

    @Override
    @Transactional
    public int deleteByTrainingProgramTitle(String title) {
        if (trainingProgramService.findByTitle(title) == null) {
            return -1;
        }
        return repository.deleteByTrainingProgramTitle(title);
    }

    private final WeeklyTemplateRepository repository;
    private final TrainingProgramService trainingProgramService;
}
