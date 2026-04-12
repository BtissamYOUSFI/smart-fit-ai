package fit.smart.smartfitapi.ws.facade;

import fit.smart.smartfitapi.entity.Session;
import fit.smart.smartfitapi.service.facade.SessionService;
import fit.smart.smartfitapi.ws.converter.SessionConverter;
import fit.smart.smartfitapi.ws.dto.SessionDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/session/")
public class SessionController {

    @GetMapping("")
    public ResponseEntity<List<SessionDto>> findAll() {
        List<Session> sessions = service.findAll();
        return new ResponseEntity<>(converter.toDtos(sessions), HttpStatus.OK);
    }

    @GetMapping("id/{id}")
    public ResponseEntity<SessionDto> findById(@PathVariable Long id) {
        Session byId = service.findById(id);
        HttpStatus httpStatus;
        if (byId == null) {
            httpStatus = HttpStatus.NOT_FOUND;
        } else {
            httpStatus = HttpStatus.OK;
        }
        return new ResponseEntity<>(converter.toDto(byId), httpStatus);
    }

    @PostMapping("")
    public ResponseEntity<SessionDto> save(@RequestBody SessionDto sessionDto) {
        Session saved = service.save(converter.toEntity(sessionDto));
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
    private SessionService service;

    @Autowired
    private SessionConverter converter;
}