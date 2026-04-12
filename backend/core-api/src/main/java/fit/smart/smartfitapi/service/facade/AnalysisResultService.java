package fit.smart.smartfitapi.service.facade;

import fit.smart.smartfitapi.entity.AnalysisResult;

import java.util.List;

public interface AnalysisResultService {

    List<AnalysisResult> findAll();
    AnalysisResult findById(Long id);
    AnalysisResult save(AnalysisResult analysisResult);
    int deleteById(Long id);

}

