package fit.smart.smartfitapi.service.facade;

import fit.smart.smartfitapi.entity.Session;

import java.util.List;

public interface SessionService {

    List<Session> findAll();
    Session findById(Long id);
    Session save(Session session);
    int deleteById(Long id);

}
