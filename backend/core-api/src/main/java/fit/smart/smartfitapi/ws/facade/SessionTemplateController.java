package fit.smart.smartfitapi.ws.facade;

import fit.smart.smartfitapi.entity.SessionTemplate;
import fit.smart.smartfitapi.service.facade.SessionTemplateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/session-template/")
public class SessionTemplateController {

    @GetMapping("")
    public ResponseEntity<List<SessionTemplate>> findAll() {
        List<SessionTemplate> templates = service.findAll();
        return new ResponseEntity<>(templates, HttpStatus.OK);
    }

    @GetMapping("")
    public ResponseEntity<SessionTemplate> findById(Long id) {
        SessionTemplate byId = service.findById(id);
        HttpStatus httpStatus ;
        if (byId == null) {
            httpStatus = HttpStatus.NOT_FOUND;
        }
        httpStatus =HttpStatus.OK;
        return new ResponseEntity<>(byId, httpStatus);
    }

    @PostMapping("")
    public ResponseEntity<SessionTemplate> save(SessionTemplate sessionTemplate) {
        SessionTemplate st = service.save(sessionTemplate);
        HttpStatus httpStatus ;
        if (st == null) {
            httpStatus = HttpStatus.CONFLICT;
        }else{
            httpStatus = HttpStatus.CREATED;
        }
        return new ResponseEntity<>(st, httpStatus);
    }

    @DeleteMapping("id/{id}")
    public ResponseEntity<Integer> delete(@PathVariable Long id) {
        int i = service.deleteById(id);
        HttpStatus httpStatus ;
        if (i > 0) {
            httpStatus = HttpStatus.OK;
        }else {
            httpStatus = HttpStatus.NOT_FOUND;
        }
        return new ResponseEntity<>(i, httpStatus);
    }

    @Autowired
    private SessionTemplateService service;
}
