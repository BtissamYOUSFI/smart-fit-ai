package fit.smart.smartfitapi.service.impl;

import fit.smart.smartfitapi.entity.Session;
import fit.smart.smartfitapi.repository.SessionRepository;
import fit.smart.smartfitapi.service.facade.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SessionServiceImpl implements SessionService {

    @Override
    public List<Session> findAll() {
        return repo.findAll();
    }

    @Override
    public Session findById(Long id) {
        return repo.findById(id).orElse(null);
    }

    @Override
    public Session save(Session session) {
        return repo.save(session);
    }

    @Override
    public int deleteById(Long id) {
        return repo.deleteSessionById(id);
    }

    @Autowired
    private SessionRepository repo;
}
