package fit.smart.smartfitapi.service.facade;

import fit.smart.smartfitapi.entity.WeeklyTemplate;

import java.util.List;

public interface WeeklyTemplateService {
    WeeklyTemplate findByLabel(String label);
    int deleteById(long id);
    List<WeeklyTemplate> findByTrainingProgramTitle(String title);
    List<WeeklyTemplate> findAll();
    WeeklyTemplate save(WeeklyTemplate weeklyTemplate);
    WeeklyTemplate update(WeeklyTemplate weeklyTemplate);
    int deleteByTrainingProgramTitle(String title);

}
