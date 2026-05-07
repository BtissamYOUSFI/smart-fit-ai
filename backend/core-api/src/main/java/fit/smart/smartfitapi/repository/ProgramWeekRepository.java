package fit.smart.smartfitapi.repository;

import fit.smart.smartfitapi.entity.ProgramWeek;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProgramWeekRepository extends JpaRepository<ProgramWeek, Long> {
    int deleteProgramWeekById(long id);
    Optional<ProgramWeek> findByTrainingProgramIdAndWeekNumber(Long programId, Integer weekNumber);
}
