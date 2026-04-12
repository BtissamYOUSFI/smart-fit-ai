package fit.smart.smartfitapi.service.facade;

import fit.smart.smartfitapi.entity.ProgramWeek;

import java.util.List;

public interface ProgramWeekService {

    List<ProgramWeek> findAll();
    ProgramWeek findById(Long id);
    ProgramWeek save(ProgramWeek programWeek);
    int deleteById(Long id);

}
