package fit.smart.smartfitapi.service.impl;

import fit.smart.smartfitapi.entity.*;
import fit.smart.smartfitapi.repository.ExerciseRepRepository;
import fit.smart.smartfitapi.repository.ProgramWeekRepository;
import fit.smart.smartfitapi.repository.TrainingProgramRepository;
import fit.smart.smartfitapi.service.facade.ProgramWeekService;
import fit.smart.smartfitapi.util.enums.RepeatMode;
import fit.smart.smartfitapi.util.enums.SessionStatus;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.WeekFields;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
@AllArgsConstructor
public class ProgramWeekServiceImpl implements ProgramWeekService {

    private final ProgramWeekRepository repo;
    private final TrainingProgramRepository programRepo;
    private final ExerciseRepRepository exerciseRepRepo;

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
    @Transactional
    public int deleteById(Long id) {
        return repo.deleteProgramWeekById(id);
    }

    @Override
    @Transactional
    public ProgramWeek getOrGenerateWeek(Long programId, Integer weekNumber) {
        return repo.findByTrainingProgramIdAndWeekNumber(programId, weekNumber)
                .orElseGet(() -> generateWeek(programId, weekNumber));
    }

    private ProgramWeek generateWeek(Long programId, Integer weekNumber) {
        TrainingProgram program = programRepo.findById(programId).orElseThrow();

        LocalDate weekStart = program.getStartDate().plusWeeks(weekNumber - 1);

        WeeklyTemplate template = resolveTemplate(program, weekNumber, weekStart);

        ProgramWeek week = ProgramWeek.builder()
                .trainingProgram(program)
                .weekNumber(weekNumber)
                .startDate(weekStart)
                .isCustomized(false)
                .weeklyTemplate(template)
                .build();

        if (template != null) {
            List<Session> sessions = new ArrayList<>();
            for (SessionTemplate st : template.getSessionTemplates()) {
                LocalDate sessionDate = weekStart;
                DayOfWeek targetDay = st.getDayOfWeek();
                while (sessionDate.getDayOfWeek() != targetDay) {
                    sessionDate = sessionDate.plusDays(1);
                }

                Session session = Session.builder()
                        .dayOfWeek(targetDay)
                        .scheduledDate(sessionDate)
                        .status(SessionStatus.PLANNED)
                        .programWeek(week)
                        .build();

                List<Exercise> exercises = new ArrayList<>();
                for (ExerciseTemplate et : st.getExerciseTemplates()) {
                    Exercise ex = Exercise.builder()
                            .exerciseType(et.getExerciseType())
                            .plannedSets(et.getSets())
                            .plannedRepsPerSet(et.getRepsPerSet())
                            .orderInSession(et.getOrderInSession())
                            .session(session)
                            .build();

                    List<ExerciseRep> reps = new ArrayList<>();
                    for (int i = 1; i <= et.getSets(); i++) {
                        reps.add(ExerciseRep.builder()
                                .repNumber(i)
                                .exercise(ex)
                                .build());
                    }
                    ex.setReps(reps);
                    exercises.add(ex);
                }
                session.setExercises(exercises);
                sessions.add(session);
            }
            week.setSessions(sessions);
        }

        return repo.save(week);
    }

    private WeeklyTemplate resolveTemplate(TrainingProgram program, Integer weekNumber, LocalDate weekStart) {
        List<WeeklyTemplate> templates = program.getWeeklyTemplates();
        if (templates == null || templates.isEmpty()) return null;

        RepeatMode mode = templates.get(0).getRepeatMode();

        return switch (mode) {
            case ALL_WEEKS -> templates.get(0);
            case BY_WEEK_OF_MONTH -> {
                int weekOfMonth = weekStart.get(WeekFields.of(Locale.getDefault()).weekOfMonth());
                int idx = Math.min(weekOfMonth - 1, templates.size() - 1);
                yield templates.get(Math.max(0, idx));
            }
            case INDEPENDENT -> null;
        };
    }
}
