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
    List<TrainingProgram> findByUserEmail(String email);
    TrainingProgram findActiveByUserEmail(String email);
    /** Updates title/dates and removes any ProgramWeeks that fall outside the new period. Returns null on date overlap. */
    TrainingProgram patch(Long id, String title, LocalDate startDate, LocalDate endDate);
}
