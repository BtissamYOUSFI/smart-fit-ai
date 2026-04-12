package fit.smart.smartfitapi.ws.facade;

import fit.smart.smartfitapi.entity.WeeklyTemplate;
import fit.smart.smartfitapi.service.facade.WeeklyTemplateService;
import fit.smart.smartfitapi.ws.converter.WeeklyTemplateConverter;
import fit.smart.smartfitapi.ws.dto.WeeklyTemplateDto;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/weekly-template/")
public class WeeklyTemplateController {

    @GetMapping("label/{label}")
    public ResponseEntity<WeeklyTemplateDto> findByLabel(@PathVariable String label) {
        WeeklyTemplate entity = service.findByLabel(label);
        if (entity == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(converter.toDto(entity));
    }

    @DeleteMapping("id/{id}")
    public ResponseEntity<Integer> deleteById(@PathVariable long id) {
        int result = service.deleteById(id);
        if (result > 0) {
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("title/{title}")
    public ResponseEntity<List<WeeklyTemplateDto>> findByTrainingProgramTitle(@PathVariable String title) {
        List<WeeklyTemplate> list= service.findByTrainingProgramTitle(title);
        if (list.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(converter.toDtos(list));
    }

    @GetMapping("all")
    public ResponseEntity<List<WeeklyTemplateDto>> findAll() {
        List<WeeklyTemplate> list= service.findAll();
        if (list.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(converter.toDtos(list));
    }

    @PostMapping("add-one")
    public ResponseEntity<WeeklyTemplateDto> save(@RequestBody WeeklyTemplateDto weeklyTemplate) {
        WeeklyTemplate entity = converter.toEntity(weeklyTemplate);
        WeeklyTemplate saved = service.save(entity);
        if (saved == null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        return ResponseEntity.ok(converter.toDto(saved));
    }

    @PutMapping("update")
    public ResponseEntity<WeeklyTemplateDto> update(@RequestBody WeeklyTemplateDto weeklyTemplate) {
        WeeklyTemplate entity = converter.toEntity(weeklyTemplate);
        WeeklyTemplate updated = service.update(entity);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(converter.toDto(updated));
    }

    @DeleteMapping("title/{title}")
    public ResponseEntity<Integer> deleteByTrainingProgramTitle(@PathVariable String title) {
        int result = service.deleteByTrainingProgramTitle(title);
        if (result > 0) {
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.notFound().build();
    }

    private final WeeklyTemplateService service;
    private final WeeklyTemplateConverter converter;
}
