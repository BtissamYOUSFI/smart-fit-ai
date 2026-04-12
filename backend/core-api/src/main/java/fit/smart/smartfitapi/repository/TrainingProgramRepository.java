package fit.smart.smartfitapi.repository;

import fit.smart.smartfitapi.entity.TrainingProgram;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TrainingProgramRepository extends JpaRepository<TrainingProgram, Long> {
    TrainingProgram findByTitle(String title);
    List<TrainingProgram> findByStartDateBetween(LocalDate startDate, LocalDate endDate);
    void deleteById(long id);
    TrainingProgram findById(long id);
}
