package fit.smart.smartfitapi.ws.facade;

import fit.smart.smartfitapi.entity.TrainingProgram;
import fit.smart.smartfitapi.service.facade.TrainingProgramService;
import fit.smart.smartfitapi.ws.converter.TrainingProgramConverter;
import fit.smart.smartfitapi.ws.dto.TrainingProgramDto;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@AllArgsConstructor
@RestController
@RequestMapping("/api/training-program/")
public class TrainingProgramController {

    private final TrainingProgramService service;
    private final TrainingProgramConverter converter;

    /** Programs belonging to the authenticated user. */
    @GetMapping("my")
    public ResponseEntity<List<TrainingProgramDto>> findMine(Authentication auth) {
        List<TrainingProgram> list = service.findByUserEmail(auth.getName());
        if (list.isEmpty()) return ResponseEntity.noContent().build();
        return ResponseEntity.ok(converter.toDtos(list));
    }

    /** Active program (today falls within its period) for the authenticated user. */
    @GetMapping("my/active")
    public ResponseEntity<TrainingProgramDto> findActiveProgram(Authentication auth) {
        TrainingProgram program = service.findActiveByUserEmail(auth.getName());
        if (program == null) return ResponseEntity.noContent().build();
        return ResponseEntity.ok(converter.toDto(program));
    }

    @PostMapping("add-one")
    public ResponseEntity<?> save(@RequestBody TrainingProgramDto dto) {
        TrainingProgram entity = converter.toEntity(dto);
        TrainingProgram saved = service.save(entity);
        if (saved == null) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "You already have a program during this period. Programs cannot overlap."));
        }
        return ResponseEntity.ok(converter.toDto(saved));
    }

    @GetMapping("all")
    public ResponseEntity<List<TrainingProgramDto>> findAll() {
        List<TrainingProgram> list = service.findAll();
        if (list.isEmpty()) return ResponseEntity.noContent().build();
        return ResponseEntity.ok(converter.toDtos(list));
    }

    @PatchMapping("id/{id}")
    public ResponseEntity<?> patch(@PathVariable Long id, @RequestBody Map<String, String> body, Authentication auth) {
        TrainingProgram existing = service.findById(id);
        if (existing == null) return ResponseEntity.notFound().build();
        if (!existing.getUser().getEmail().equals(auth.getName())) return ResponseEntity.status(HttpStatus.FORBIDDEN).build();

        LocalDate startDate = body.containsKey("startDate") ? LocalDate.parse(body.get("startDate")) : null;
        LocalDate endDate   = body.containsKey("endDate")   ? LocalDate.parse(body.get("endDate"))   : null;

        TrainingProgram updated = service.patch(id, body.get("title"), startDate, endDate);
        if (updated == null) return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("message", "You already have a program during this period."));
        return ResponseEntity.ok(converter.toDto(updated));
    }

    @DeleteMapping("id/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id, Authentication auth) {
        TrainingProgram program = service.findById(id);
        if (program == null) return ResponseEntity.notFound().build();
        if (!program.getUser().getEmail().equals(auth.getName())) return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        service.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("title/{title}")
    public ResponseEntity<TrainingProgramDto> findByTitle(@PathVariable String title) {
        TrainingProgram entity = service.findByTitle(title);
        if (entity == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(converter.toDto(entity));
    }

    @GetMapping("start-date/{startDate}/end-date/{endDate}")
    public ResponseEntity<List<TrainingProgramDto>> findByStartDateBetween(
            @PathVariable LocalDate startDate, @PathVariable LocalDate endDate) {
        List<TrainingProgram> list = service.findByStartDateBetween(startDate, endDate);
        if (list.isEmpty()) return ResponseEntity.noContent().build();
        return ResponseEntity.ok(converter.toDtos(list));
    }

    @PutMapping("update")
    public ResponseEntity<?> update(@RequestBody TrainingProgramDto dto) {
        TrainingProgram entity = converter.toEntity(dto);
        TrainingProgram updated = service.update(entity);
        if (updated == null) return ResponseEntity.status(HttpStatus.CONFLICT).build();
        return ResponseEntity.ok(converter.toDto(updated));
    }

    @GetMapping("id/{id}")
    public ResponseEntity<TrainingProgramDto> findById(@PathVariable Long id) {
        TrainingProgram entity = service.findById(id);
        if (entity == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(converter.toDto(entity));
    }
}
