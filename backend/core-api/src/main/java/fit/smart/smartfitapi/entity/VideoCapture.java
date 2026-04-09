package fit.smart.smartfitapi.entity;

import fit.smart.smartfitapi.util.enums.CaptureMode;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "video_captures")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VideoCapture {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CaptureMode sourceMode;

    @Column(nullable = false)
    private String filePath;

    private Integer durationSeconds;

    private LocalDateTime uploadedAt;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercise_id", nullable = false)
    private Exercise exercise;

    @PrePersist
    protected void onUpload() {
        this.uploadedAt = LocalDateTime.now();
    }

    public boolean isReady() {
        return filePath != null && !filePath.isBlank();
    }
}
