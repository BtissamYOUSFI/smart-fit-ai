package fit.smart.smartfitapi.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "training_programs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrainingProgram {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private LocalDate startDate;
    private LocalDate endDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "trainingProgram", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<WeeklyTemplate> weeklyTemplates = new ArrayList<>();

    @OneToMany(mappedBy = "trainingProgram", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<ProgramWeek> programWeeks = new ArrayList<>();

    public Double getGlobalScore() {
        return programWeeks.stream()
                .flatMap(w -> w.getSessions().stream())
                .filter(s -> s.getGlobalScore() != null)
                .mapToDouble(Session::getGlobalScore)
                .average()
                .orElse(0.0);
    }

    public Double getCompletionRate() {
        List<Session> all = programWeeks.stream()
                .flatMap(w -> w.getSessions().stream())
                .toList();
        if (all.isEmpty()) return 0.0;
        long completed = all.stream().filter(Session::isCompleted).count();
        return (double) completed / all.size() * 100;
    }
}
