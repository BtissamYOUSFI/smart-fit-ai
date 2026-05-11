package fit.smart.smartfitapi.service.impl;

import fit.smart.smartfitapi.entity.TrainingProgram;
import fit.smart.smartfitapi.repository.TrainingProgramRepository;
import fit.smart.smartfitapi.service.facade.TrainingProgramService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@AllArgsConstructor
@Service
public class TrainingProgramServiceImpl implements TrainingProgramService {

    private final TrainingProgramRepository repository;

    @Override
    public TrainingProgram save(TrainingProgram program) {
        Long excludeId = program.getId() != null ? program.getId() : -1L;
        if (program.getUser() != null &&
                repository.existsOverlappingProgram(
                        program.getUser().getEmail(),
                        program.getStartDate(),
                        program.getEndDate(),
                        excludeId)) {
            return null;
        }
        return repository.save(program);
    }

    @Override
    public List<TrainingProgram> findAll() {
        return repository.findAll();
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        // Use find + delete (not deleteById) so JPA cascade fires through em.remove(),
        // which deletes the entire child tree in the correct FK order.
        repository.findById(id).ifPresent(repository::delete);
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
    public TrainingProgram update(TrainingProgram program) {
        return repository.save(program);
    }

    @Override
    public TrainingProgram findById(Long id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public List<TrainingProgram> findByUserEmail(String email) {
        return repository.findByUserEmail(email);
    }

    @Override
    public TrainingProgram findActiveByUserEmail(String email) {
        List<TrainingProgram> active = repository.findActiveByUserEmail(email, LocalDate.now());
        return active.isEmpty() ? null : active.get(0);
    }

    @Override
    @Transactional
    public TrainingProgram patch(Long id, String title, LocalDate startDate, LocalDate endDate) {
        TrainingProgram program = repository.findById(id).orElse(null);
        if (program == null) return null;

        if (title != null && !title.isBlank()) program.setTitle(title);
        if (startDate != null) program.setStartDate(startDate);
        if (endDate != null)   program.setEndDate(endDate);

        if (repository.existsOverlappingProgram(
                program.getUser().getEmail(), program.getStartDate(), program.getEndDate(), id)) {
            return null;
        }

        LocalDate newStart = program.getStartDate();
        LocalDate newEnd   = program.getEndDate();
        program.getProgramWeeks().removeIf(week ->
            week.getStartDate() != null &&
            (week.getStartDate().isBefore(newStart) || week.getStartDate().isAfter(newEnd))
        );

        return repository.save(program);
    }
}
