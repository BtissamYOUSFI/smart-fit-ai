package fit.smart.smartfitapi.repository;

import fit.smart.smartfitapi.entity.AnalysisResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnalysisResultRepository extends JpaRepository<AnalysisResult,Long> {
    int deleteAnalysisResultById(long id);
}
