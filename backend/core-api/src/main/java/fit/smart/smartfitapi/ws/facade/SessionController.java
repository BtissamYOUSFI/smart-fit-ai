package fit.smart.smartfitapi.ws.facade;

import fit.smart.smartfitapi.entity.Session;
import fit.smart.smartfitapi.service.facade.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/session/")
public class SessionController {

    @GetMapping("")
    public ResponseEntity<List<Session>> findAll() {
        List<Session> sessions = service.findAll();
        return new ResponseEntity<>(sessions, HttpStatus.OK);
    }

    @GetMapping("id/{id}")
    public ResponseEntity<Session> findById(@PathVariable Long id) {
        Session byId = service.findById(id);
        HttpStatus httpStatus;
        if (byId == null) {
            httpStatus = HttpStatus.NOT_FOUND;
        } else {
            httpStatus = HttpStatus.OK;
        }
        return new ResponseEntity<>(byId, httpStatus);
    }

    @PostMapping("")
    public ResponseEntity<Session> save(@RequestBody Session session) {
        Session saved = service.save(session);
        HttpStatus httpStatus;
        if (saved == null) {
            httpStatus = HttpStatus.CONFLICT;
        } else {
            httpStatus = HttpStatus.CREATED;
        }
        return new ResponseEntity<>(saved, httpStatus);
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
}
