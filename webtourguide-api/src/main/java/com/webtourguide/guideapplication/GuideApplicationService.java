package com.webtourguide.guideapplication;

import com.webtourguide.exception.ResourceNotFoundException;
import com.webtourguide.guideapplication.dto.*;
import com.webtourguide.tourguide.TourGuideService;
import com.webtourguide.tourguide.dto.TourGuideResponse;
import com.webtourguide.user.Role;
import com.webtourguide.user.User;
import com.webtourguide.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Business-logic layer for the "apply to become a guide" workflow.
 * A TOURIST submits an application; ADMIN reviews it, and approving it
 * promotes the applicant's account to TOUR_GUIDE, sets a login password
 * for them, and creates their guide profile in one transaction.
 */
@Service
public class GuideApplicationService {

    private static final Logger log = LoggerFactory.getLogger(GuideApplicationService.class);

    private final GuideApplicationRepository repository;
    private final UserRepository userRepository;
    private final TourGuideService tourGuideService;
    private final PasswordEncoder passwordEncoder;

    public GuideApplicationService(GuideApplicationRepository repository, UserRepository userRepository,
                                    TourGuideService tourGuideService, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.userRepository = userRepository;
        this.tourGuideService = tourGuideService;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public GuideApplicationResponse apply(Authentication auth, GuideApplicationRequest req) {
        User user = currentUser(auth);
        if (user.getRole() != Role.TOURIST)
            throw new IllegalStateException("Only tourist accounts can apply to become a guide");
        if (repository.existsByApplicantIdAndStatus(user.getId(), ApplicationStatus.PENDING))
            throw new IllegalStateException("You already have a pending guide application");

        GuideApplication app = GuideApplication.builder()
                .applicant(user).languages(req.getLanguages()).skills(req.getSkills())
                .certifications(req.getCertifications()).location(req.getLocation())
                .yearsExperience(req.getYearsExperience()).message(req.getMessage())
                .status(ApplicationStatus.PENDING).build();
        GuideApplicationResponse saved = toResponse(repository.save(app));
        log.info("Guide application submitted: id={} by userId={}", saved.getId(), user.getId());
        return saved;
    }

    @Transactional(readOnly = true)
    public List<GuideApplicationResponse> getMine(Authentication auth) {
        User user = currentUser(auth);
        return repository.findByApplicantIdOrderByCreatedAtDesc(user.getId())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<GuideApplicationResponse> getAll(ApplicationStatus status) {
        List<GuideApplication> apps = status == null
                ? repository.findAllByOrderByCreatedAtDesc()
                : repository.findByStatusOrderByCreatedAtDesc(status);
        return apps.stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public TourGuideResponse approve(Long id, GuideApplicationApproveRequest req) {
        GuideApplication app = findEntity(id);
        if (app.getStatus() != ApplicationStatus.PENDING)
            throw new IllegalStateException("This application has already been reviewed");

        User user = app.getApplicant();
        user.setRole(Role.TOUR_GUIDE);
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        userRepository.save(user);

        TourGuideResponse profile = tourGuideService.createProfileForUser(
                user, app.getLanguages(), app.getSkills(), app.getCertifications(),
                app.getLocation(), app.getYearsExperience());

        app.setStatus(ApplicationStatus.APPROVED);
        app.setReviewedAt(LocalDateTime.now());
        repository.save(app);

        log.info("Guide application id={} approved -> guideId={}", id, profile.getId());
        return profile;
    }

    @Transactional
    public GuideApplicationResponse reject(Long id, GuideApplicationRejectRequest req) {
        GuideApplication app = findEntity(id);
        if (app.getStatus() != ApplicationStatus.PENDING)
            throw new IllegalStateException("This application has already been reviewed");

        app.setStatus(ApplicationStatus.REJECTED);
        app.setReviewNote(req.getReviewNote());
        app.setReviewedAt(LocalDateTime.now());
        GuideApplicationResponse saved = toResponse(repository.save(app));
        log.info("Guide application id={} rejected", id);
        return saved;
    }

    private User currentUser(Authentication auth) {
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private GuideApplication findEntity(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Guide application " + id + " not found"));
    }

    private GuideApplicationResponse toResponse(GuideApplication a) {
        return GuideApplicationResponse.builder()
                .id(a.getId()).applicantId(a.getApplicant().getId())
                .applicantName(a.getApplicant().getFullName()).applicantEmail(a.getApplicant().getEmail())
                .languages(a.getLanguages()).skills(a.getSkills()).certifications(a.getCertifications())
                .location(a.getLocation()).yearsExperience(a.getYearsExperience()).message(a.getMessage())
                .status(a.getStatus().name()).createdAt(a.getCreatedAt()).reviewedAt(a.getReviewedAt())
                .reviewNote(a.getReviewNote()).build();
    }
}
