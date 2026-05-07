package fit.smart.smartfitapi.ws.facade;

import fit.smart.smartfitapi.entity.ProgramWeek;
import fit.smart.smartfitapi.service.facade.ProgramWeekService;
import fit.smart.smartfitapi.ws.converter.ProgramWeekConverter;
import fit.smart.smartfitapi.ws.dto.ProgramWeekDto;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/program-week/")
@AllArgsConstructor
public class ProgramWeekController {

    private final ProgramWeekService service;
    private final ProgramWeekConverter converter;

    @GetMapping("")
    public ResponseEntity<List<ProgramWeekDto>> findAll() {
        List<ProgramWeek> programWeeks = service.findAll();
        return new ResponseEntity<>(converter.toDtos(programWeeks), HttpStatus.OK);
    }

    @GetMapping("id/{id}")
    public ResponseEntity<ProgramWeekDto> findById(@PathVariable Long id) {
        ProgramWeek byId = service.findById(id);
        if (byId == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(converter.toDto(byId));
    }

    /** Lazy-generate (or fetch) a specific week by program + week number. */
    @GetMapping("program/{programId}/week/{weekNumber}")
    public ResponseEntity<ProgramWeekDto> getOrGenerate(
            @PathVariable Long programId,
            @PathVariable Integer weekNumber) {
        ProgramWeek week = service.getOrGenerateWeek(programId, weekNumber);
        return ResponseEntity.ok(converter.toDto(week));
    }

    @PostMapping("")
    public ResponseEntity<ProgramWeekDto> save(@RequestBody ProgramWeekDto dto) {
        ProgramWeek saved = service.save(converter.toEntity(dto));
        if (saved == null) return ResponseEntity.status(HttpStatus.CONFLICT).build();
        return ResponseEntity.status(HttpStatus.CREATED).body(converter.toDto(saved));
    }

    @DeleteMapping("id/{id}")
    public ResponseEntity<Integer> delete(@PathVariable Long id) {
        int i = service.deleteById(id);
        return i > 0 ? ResponseEntity.ok(i) : ResponseEntity.notFound().build();
    }
}
