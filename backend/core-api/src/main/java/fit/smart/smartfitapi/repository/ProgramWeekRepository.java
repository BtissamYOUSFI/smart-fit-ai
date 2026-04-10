package fit.smart.smartfitapi.repository;

import fit.smart.smartfitapi.entity.ProgramWeek;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProgramWeekRepository extends JpaRepository<ProgramWeek, Long> {
    ProgramWeek findProgramWeekById(long id);
}
