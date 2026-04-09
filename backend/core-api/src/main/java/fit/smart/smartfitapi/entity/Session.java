package fit.smart.smartfitapi.entity;

import fit.smart.smartfitapi.util.enums.SessionStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Session {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DayOfWeek dayOfWeek;

    private LocalDate scheduledDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private SessionStatus status = SessionStatus.PLANNED;

    private Double globalScore;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "program_week_id", nullable = false)
    private ProgramWeek programWeek;

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Exercise> exercises = new ArrayList<>();

    public Double calculateGlobalScore() {
        this.globalScore = exercises.stream()
                .filter(e -> e.getScore() != null)
                .mapToDouble(Exercise::getScore)
                .average()
                .orElse(0.0);
        return this.globalScore;
    }

    public boolean isCompleted() {
        return SessionStatus.COMPLETED.equals(this.status);
    }
}
