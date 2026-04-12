package fit.smart.smartfitapi.service.impl;

import fit.smart.smartfitapi.entity.ProgramWeek;
import fit.smart.smartfitapi.repository.ProgramWeekRepository;
import fit.smart.smartfitapi.service.facade.ProgramWeekService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProgramWeekServiceImpl implements ProgramWeekService {

    @Override
    public List<ProgramWeek> findAll() {
        return repo.findAll();
    }

    @Override
    public ProgramWeek findById(Long id) {
        return repo.findById(id).orElse(null);
    }

    @Override
    public ProgramWeek save(ProgramWeek programWeek) {
        return repo.save(programWeek);
    }

    @Override
    public int deleteById(Long id) {
        return repo.deleteProgramWeekById(id);
    }

    @Autowired
    private ProgramWeekRepository repo;
}
