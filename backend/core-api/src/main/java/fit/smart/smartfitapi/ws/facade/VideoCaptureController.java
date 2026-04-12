package fit.smart.smartfitapi.ws.facade;

import fit.smart.smartfitapi.entity.VideoCapture;
import fit.smart.smartfitapi.service.facade.VideoCaptureService;
import fit.smart.smartfitapi.ws.converter.VideoCaptureConverter;
import fit.smart.smartfitapi.ws.dto.VideoCaptureDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/video-capture/")
public class VideoCaptureController {

    @GetMapping("")
    public ResponseEntity<List<VideoCaptureDto>> findAll() {
        List<VideoCapture> videoCaptures = service.findAll();
        return new ResponseEntity<>(converter.toDtos(videoCaptures), HttpStatus.OK);
    }

    @GetMapping("id/{id}")
    public ResponseEntity<VideoCaptureDto> findById(@PathVariable Long id) {
        VideoCapture byId = service.findById(id);
        HttpStatus httpStatus;
        if (byId == null) {
            httpStatus = HttpStatus.NOT_FOUND;
        } else {
            httpStatus = HttpStatus.OK;
        }
        return new ResponseEntity<>(converter.toDto(byId), httpStatus);
    }

    @PostMapping("")
    public ResponseEntity<VideoCaptureDto> save(@RequestBody VideoCaptureDto videoCaptureDto) {
        VideoCapture saved = service.save(converter.toEntity(videoCaptureDto));
        HttpStatus httpStatus;
        if (saved == null) {
            httpStatus = HttpStatus.CONFLICT;
        } else {
            httpStatus = HttpStatus.CREATED;
        }
        return new ResponseEntity<>(converter.toDto(saved), httpStatus);
    }

    @DeleteMapping("id/{id}")
    public ResponseEntity<Integer> delete(@PathVariable Long id) {
        int i = service.deleteById(id);
        HttpStatus httpStatus;
        if (i > 0) {
            httpStatus = HttpStatus.OK;
        } else {
            httpStatus = HttpStatus.NOT_FOUND;
        }
        return new ResponseEntity<>(i, httpStatus);
    }

    @Autowired
    private VideoCaptureService service;

    @Autowired
    private VideoCaptureConverter converter;

}


