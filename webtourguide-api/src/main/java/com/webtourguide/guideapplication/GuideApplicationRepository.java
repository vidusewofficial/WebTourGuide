package com.webtourguide.guideapplication;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GuideApplicationRepository extends JpaRepository<GuideApplication, Long> {

    List<GuideApplication> findByApplicantIdOrderByCreatedAtDesc(Long applicantId);

    List<GuideApplication> findByStatusOrderByCreatedAtDesc(ApplicationStatus status);

    List<GuideApplication> findAllByOrderByCreatedAtDesc();

    boolean existsByApplicantIdAndStatus(Long applicantId, ApplicationStatus status);
}
