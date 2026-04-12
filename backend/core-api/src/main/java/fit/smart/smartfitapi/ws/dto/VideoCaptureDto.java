package fit.smart.smartfitapi.ws.dto;

import fit.smart.smartfitapi.util.enums.CaptureMode;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
public class VideoCaptureDto {

    private Long id;

    private CaptureMode sourceMode;

    private String filePath;

    private Integer durationSeconds;

    private LocalDateTime uploadedAt;

    private Long exerciseId;

}

