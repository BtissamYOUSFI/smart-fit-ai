package fit.smart.smartfitapi.service.facade;

import fit.smart.smartfitapi.entity.TrainingProgram;

import java.time.LocalDate;
import java.util.List;

public interface TrainingProgramService {
    TrainingProgram save(TrainingProgram trainingProgram);
    List<TrainingProgram> findAll();
    void deleteById(Long id);
    TrainingProgram findByTitle(String title);
    List<TrainingProgram> findByStartDateBetween(LocalDate startDate, LocalDate endDate);
    TrainingProgram update(TrainingProgram trainingProgram);
    TrainingProgram findById(Long id);
}
