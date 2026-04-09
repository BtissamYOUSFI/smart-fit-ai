package fit.smart.smartfitapi.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.DayOfWeek;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "session_templates")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SessionTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DayOfWeek dayOfWeek;

    @Column(nullable = false)
    private Integer orderInWeek;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "weekly_template_id", nullable = false)
    private WeeklyTemplate weeklyTemplate;

    @OneToMany(mappedBy = "sessionTemplate", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<ExerciseTemplate> exerciseTemplates = new ArrayList<>();

    public List<ExerciseTemplate> getExerciseTemplates() {
        return exerciseTemplates;
    }
}
