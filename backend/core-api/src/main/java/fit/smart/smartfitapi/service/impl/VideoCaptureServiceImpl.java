package fit.smart.smartfitapi.service.impl;

import fit.smart.smartfitapi.entity.VideoCapture;
import fit.smart.smartfitapi.repository.VideoCaptureRepository;
import fit.smart.smartfitapi.service.facade.VideoCaptureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VideoCaptureServiceImpl implements VideoCaptureService {

    @Override
    public List<VideoCapture> findAll() {
        return repo.findAll();
    }

    @Override
    public VideoCapture findById(Long id) {
        return repo.findById(id).orElse(null);
    }

    @Override
    public VideoCapture save(VideoCapture videoCapture) {
        return repo.save(videoCapture);
    }

    @Override
    public int deleteById(Long id) {
        return repo.deleteVideoCaptureById(id);
    }

    @Autowired
    private VideoCaptureRepository repo;
}

