package fit.smart.smartfitapi.ws.facade;

import fit.smart.smartfitapi.entity.AnalysisResult;
import fit.smart.smartfitapi.service.facade.AnalysisResultService;
import fit.smart.smartfitapi.ws.converter.AnalysisResultConverter;
import fit.smart.smartfitapi.ws.dto.AnalysisResultDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analysis-result/")
public class AnalysisResultController {

	@GetMapping("")
	public ResponseEntity<List<AnalysisResultDto>> findAll() {
		List<AnalysisResult> analysisResults = service.findAll();
		return new ResponseEntity<>(converter.toDtos(analysisResults), HttpStatus.OK);
	}

	@GetMapping("id/{id}")
	public ResponseEntity<AnalysisResultDto> findById(@PathVariable Long id) {
		AnalysisResult byId = service.findById(id);
		HttpStatus httpStatus;
		if (byId == null) {
			httpStatus = HttpStatus.NOT_FOUND;
		} else {
			httpStatus = HttpStatus.OK;
		}
		return new ResponseEntity<>(converter.toDto(byId), httpStatus);
	}

	@PostMapping("")
	public ResponseEntity<AnalysisResultDto> save(@RequestBody AnalysisResultDto analysisResultDto) {
		AnalysisResult saved = service.save(converter.toEntity(analysisResultDto));
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
	private AnalysisResultService service;

	@Autowired
	private AnalysisResultConverter converter;

}

