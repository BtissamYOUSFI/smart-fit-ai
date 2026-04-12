package fit.smart.smartfitapi.service.facade;


import fit.smart.smartfitapi.entity.SessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

public interface SessionTemplateService{

    List<SessionTemplate> findAll();
    SessionTemplate findById(Long id);
    SessionTemplate save(SessionTemplate sessionTemplate);
    int deleteById(Long id);

}