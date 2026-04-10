package fit.smart.smartfitapi.service.impl;

import fit.smart.smartfitapi.entity.ProgramWeek;
import fit.smart.smartfitapi.repository.ProgramWeekRepository;
import fit.smart.smartfitapi.service.facade.ProgramWeekService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProgramWeekServiceImpl implements ProgramWeekService {
    @Autowired private ProgramWeekRepository repository;

    @Override
    public ProgramWeek save(ProgramWeek programWeek) {
            if (repository.findProgramWeekById(programWeek.getId()) != null) {
                return null;
            }
            return repository.save(programWeek);
    }

    @Override
    public ProgramWeek update(ProgramWeek programWeek) {
        if (repository.findProgramWeekById(programWeek.getId()) == null) {
            return null;
        }
        return repository.save(programWeek);
    }

    @Override
    public void delete(ProgramWeek programWeek) {
        repository.delete(programWeek);
    }

    @Override
    public ProgramWeek findProgramWeekById(long id) {
        return repository.findProgramWeekById(id);
    }
}
