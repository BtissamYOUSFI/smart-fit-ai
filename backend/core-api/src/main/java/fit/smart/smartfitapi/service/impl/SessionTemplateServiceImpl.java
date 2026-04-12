package fit.smart.smartfitapi.service.impl;

import fit.smart.smartfitapi.entity.SessionTemplate;
import fit.smart.smartfitapi.repository.SessionTemplateRepository;
import fit.smart.smartfitapi.service.facade.SessionTemplateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SessionTemplateServiceImpl implements SessionTemplateService {

    @Override
    public List<SessionTemplate> findAll() {
        return repo.findAll();
    }

    @Override
    public SessionTemplate findById(Long id) {
        return repo.findById(id).orElse(null);
    }

    @Override
    public SessionTemplate save(SessionTemplate sessionTemplate) {
        return repo.save(sessionTemplate);
    }

    @Override
    public int deleteById(Long id) {
        return repo.deleteSessionById(id);
    }

    @Autowired
    private SessionTemplateRepository repo;
}
