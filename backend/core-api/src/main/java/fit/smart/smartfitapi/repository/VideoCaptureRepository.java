package fit.smart.smartfitapi.repository;

import fit.smart.smartfitapi.entity.VideoCapture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VideoCaptureRepository extends JpaRepository<VideoCapture, Long> {
        int deleteVideoCaptureById(long id);
}

