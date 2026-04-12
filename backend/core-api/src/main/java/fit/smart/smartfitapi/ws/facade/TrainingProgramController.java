package fit.smart.smartfitapi.ws.facade;

import fit.smart.smartfitapi.entity.TrainingProgram;
import fit.smart.smartfitapi.service.facade.TrainingProgramService;
import fit.smart.smartfitapi.ws.converter.TrainingProgramConverter;
import fit.smart.smartfitapi.ws.dto.TrainingProgramDto;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/training-program/")
public class TrainingProgramController {
    
    @PostMapping("add-one")
    public ResponseEntity<TrainingProgramDto> save(@RequestBody TrainingProgramDto trainingProgram) {
        TrainingProgram entity = converter.toEntity(trainingProgram);
        TrainingProgram saved = service.save(entity);
        if (saved == null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        return ResponseEntity.ok(converter.toDto(saved));
    }

    @GetMapping("all")
    public ResponseEntity<List<TrainingProgramDto>> findAll() {
        List<TrainingProgram> list = service.findAll();
        if (list.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(converter.toDtos(list));
    }

    @DeleteMapping("id/{id}")
    public void deleteById(@PathVariable Long id) {
        service.deleteById(id);
    }

    @GetMapping("title/{title}")
    public ResponseEntity<TrainingProgramDto> findByTitle(@PathVariable String title) {
        TrainingProgram entity = service.findByTitle(title);
        if (entity == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(converter.toDto(entity));
    }

    @GetMapping("start-date/{startDate}/end-date/{endDate}")
    public ResponseEntity<List<TrainingProgramDto>> findByStartDateBetween(@PathVariable LocalDate startDate,@PathVariable LocalDate endDate) {
        List<TrainingProgram> list = service.findByStartDateBetween(startDate,endDate);
        if (list.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(converter.toDtos(list));
    }

    @PutMapping("update")
    public ResponseEntity<TrainingProgramDto> update(@RequestBody TrainingProgramDto trainingProgram) {
        TrainingProgram entity = converter.toEntity(trainingProgram);
        TrainingProgram updated = service.update(entity);
        if (updated == null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        return ResponseEntity.ok(converter.toDto(updated));
    }

    @GetMapping("id/{id}")
    public ResponseEntity<TrainingProgramDto> findById(@PathVariable Long id) {
        TrainingProgram entity = service.findById(id);
        if (entity == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(converter.toDto(entity));
    }

    private final TrainingProgramService service;
    private final TrainingProgramConverter converter;
}
