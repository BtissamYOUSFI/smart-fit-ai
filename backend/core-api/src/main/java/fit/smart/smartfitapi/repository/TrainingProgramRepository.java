package fit.smart.smartfitapi.repository;

import fit.smart.smartfitapi.entity.TrainingProgram;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TrainingProgramRepository extends JpaRepository<TrainingProgram, Long> {

    TrainingProgram findByTitle(String title);
    List<TrainingProgram> findByStartDateBetween(LocalDate startDate, LocalDate endDate);
    List<TrainingProgram> findByUserEmail(String email);
    void deleteById(long id);
    TrainingProgram findById(long id);

    /** Returns true if the user already has a program whose period overlaps [startDate, endDate]. */
    @Query("""
        SELECT COUNT(p) > 0 FROM TrainingProgram p
        WHERE p.user.email = :email
          AND p.id <> :excludeId
          AND p.startDate <= :endDate
          AND p.endDate   >= :startDate
        """)
    boolean existsOverlappingProgram(
            @Param("email")     String email,
            @Param("startDate") LocalDate startDate,
            @Param("endDate")   LocalDate endDate,
            @Param("excludeId") Long excludeId
    );

    @Query("""
        SELECT p FROM TrainingProgram p
        WHERE p.user.email = :email
          AND p.startDate <= :today
          AND p.endDate   >= :today
        """)
    List<TrainingProgram> findActiveByUserEmail(
            @Param("email") String email,
            @Param("today") LocalDate today
    );
}
