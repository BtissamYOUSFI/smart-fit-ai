package fit.smart.smartfitapi.service.facade;

import fit.smart.smartfitapi.entity.ProgramWeek;

public interface ProgramWeekService {
    ProgramWeek save(ProgramWeek programWeek);
    ProgramWeek update(ProgramWeek programWeek);
    void delete(ProgramWeek programWeek);
    ProgramWeek findProgramWeekById(long id);

}
