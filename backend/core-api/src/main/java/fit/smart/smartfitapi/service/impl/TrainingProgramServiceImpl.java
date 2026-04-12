package fit.smart.smartfitapi.service.impl;

import fit.smart.smartfitapi.entity.TrainingProgram;
import fit.smart.smartfitapi.repository.TrainingProgramRepository;
import fit.smart.smartfitapi.service.facade.TrainingProgramService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@AllArgsConstructor
@Service
public class TrainingProgramServiceImpl implements TrainingProgramService {
    @Override
    public TrainingProgram save(TrainingProgram trainingProgram) {
        if (repository.findByTitle(trainingProgram.getTitle()) != null) {
            return null;
        }
        return repository.save(trainingProgram);
    }

    @Override
    public List<TrainingProgram> findAll() {
        return repository.findAll();
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    @Override
    public TrainingProgram findByTitle(String title) {
        return repository.findByTitle(title);
    }

    @Override
    public List<TrainingProgram> findByStartDateBetween(LocalDate startDate, LocalDate endDate) {
        return repository.findByStartDateBetween(startDate, endDate);
    }

    @Override
    public TrainingProgram update(TrainingProgram trainingProgram) {
        return repository.save(trainingProgram);
    }

    @Override
    public TrainingProgram findById(Long id) {
        return repository.findById(id).orElse(null);
    }

    private final TrainingProgramRepository repository;
}
