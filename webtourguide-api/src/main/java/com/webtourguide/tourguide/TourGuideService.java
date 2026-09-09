package com.webtourguide.tourguide;

import com.webtourguide.exception.ResourceNotFoundException;
import com.webtourguide.tourguide.dto.*;
import com.webtourguide.user.Role;
import com.webtourguide.user.User;
import com.webtourguide.user.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TourGuideService {

    private final TourGuideRepository repository;
    private final UserRepository userRepository;

    public TourGuideService(TourGuideRepository repository, UserRepository userRepository) {
        this.repository = repository;
        this.userRepository = userRepository;
    }

    public List<TourGuideResponse> getAll() {
        return repository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public TourGuideResponse getById(Long id) {
        return toResponse(findEntity(id));
    }

    public List<TourGuideResponse> getAvailable() {
        return repository.findByIsAvailableTrue().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<TourGuideResponse> searchByLanguage(String language) {
        return repository.findByLanguagesContainingIgnoreCase(language)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public TourGuideResponse create(TourGuideCreateRequest req) {
        User user = userRepository.findById(req.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User " + req.getUserId() + " not found"));
        if (user.getRole() != Role.TOUR_GUIDE)
            throw new IllegalStateException("User must have role TOUR_GUIDE before a guide profile can be created");
        if (repository.existsByUserId(user.getId()))
            throw new IllegalStateException("This user already has a guide profile");

        TourGuide guide = TourGuide.builder()
                .user(user)
                .languages(req.getLanguages())
                .skills(req.getSkills())
                .certifications(req.getCertifications())
                .yearsExperience(req.getYearsExperience() == null ? 0 : req.getYearsExperience())
                .isAvailable(true)
                .rating(0.0)
                .build();
        return toResponse(repository.save(guide));
    }

    public TourGuideResponse updateProfile(Long id, TourGuideUpdateRequest req, Authentication auth) {
        TourGuide guide = findEntity(id);
        assertOwnerOrAdmin(guide, auth);
        if (req.getLanguages() != null) guide.setLanguages(req.getLanguages());
        if (req.getSkills() != null) guide.setSkills(req.getSkills());
        if (req.getCertifications() != null) guide.setCertifications(req.getCertifications());
        if (req.getYearsExperience() != null) guide.setYearsExperience(req.getYearsExperience());
        return toResponse(repository.save(guide));
    }

    public TourGuideResponse updateAvailability(Long id, AvailabilityUpdateRequest req, Authentication auth) {
        TourGuide guide = findEntity(id);
        assertOwnerOrAdmin(guide, auth);
        guide.setIsAvailable(req.getIsAvailable());
        return toResponse(repository.save(guide));
    }

    public void delete(Long id) {
        if (!repository.existsById(id))
            throw new ResourceNotFoundException("Tour guide " + id + " not found");
        repository.deleteById(id);
    }

    private void assertOwnerOrAdmin(TourGuide guide, Authentication auth) {
        boolean isAdmin = auth.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
        if (isAdmin) return;
        String email = auth.getName();
        if (!guide.getUser().getEmail().equalsIgnoreCase(email))
            throw new AccessDeniedException("You can only edit your own guide profile");
    }

    private TourGuide findEntity(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tour guide " + id + " not found"));
    }

    private TourGuideResponse toResponse(TourGuide g) {
        return TourGuideResponse.builder()
                .id(g.getId())
                .userId(g.getUser().getId())
                .fullName(g.getUser().getFullName())
                .email(g.getUser().getEmail())
                .languages(g.getLanguages())
                .skills(g.getSkills())
                .certifications(g.getCertifications())
                .yearsExperience(g.getYearsExperience())
                .isAvailable(g.getIsAvailable())
                .rating(g.getRating())
                .build();
    }
}