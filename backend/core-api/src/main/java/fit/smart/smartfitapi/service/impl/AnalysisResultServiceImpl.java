package fit.smart.smartfitapi.service.impl;

import fit.smart.smartfitapi.entity.AnalysisResult;
import fit.smart.smartfitapi.repository.AnalysisResultRepository;
import fit.smart.smartfitapi.service.facade.AnalysisResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnalysisResultServiceImpl implements AnalysisResultService {

    @Override
    public List<AnalysisResult> findAll() {
        return repo.findAll();
    }

    @Override
    public AnalysisResult findById(Long id) {
        return repo.findById(id).orElse(null);
    }

    @Override
    public AnalysisResult save(AnalysisResult analysisResult) {
        return repo.save(analysisResult);
    }

    @Override
    public int deleteById(Long id) {
        return repo.deleteAnalysisResultById(id);
    }

    @Autowired
    private AnalysisResultRepository repo;
}

