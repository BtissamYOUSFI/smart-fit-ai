package fit.smart.smartfitapi.service;

import fit.smart.smartfitapi.repository.TrainingProgramRepository;
import fit.smart.smartfitapi.service.impl.TrainingProgramServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.mockito.Mockito.mock;

public class TrainingProgramServiceImplTest {
    private TrainingProgramRepository repository;
    private TrainingProgramServiceImpl service;

    @BeforeEach
    public void setUp() {
        repository = mock(TrainingProgramRepository.class);
        service = new TrainingProgramServiceImpl(repository);
    }

    @Test
    void myFirstTest() {
        System.out.println("first test");
    }
}
