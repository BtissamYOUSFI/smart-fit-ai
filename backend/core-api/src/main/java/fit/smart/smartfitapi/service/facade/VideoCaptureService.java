package fit.smart.smartfitapi.service.facade;

import fit.smart.smartfitapi.entity.VideoCapture;

import java.util.List;

public interface VideoCaptureService {

    List<VideoCapture> findAll();
    VideoCapture findById(Long id);
    VideoCapture save(VideoCapture videoCapture);
    int deleteById(Long id);

}

