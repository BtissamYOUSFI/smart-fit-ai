package fit.smart.smartfitapi.entity;

import fit.smart.smartfitapi.util.enums.RepeatMode;
import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "weekly_templates")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeeklyTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String label;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RepeatMode repeatMode;

    private Integer weekOfMonth;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "training_program_id", nullable = false)
    private TrainingProgram trainingProgram;

    @OneToMany(mappedBy = "weeklyTemplate", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<SessionTemplate> sessionTemplates = new ArrayList<>();

    public List<SessionTemplate> getSessions() {
        return sessionTemplates;
    }

    public void applyToWeek(ProgramWeek week) {
        week.setWeeklyTemplate(this);
        week.setCustomized(false);
    }
}
