package com.webtourguide.tourguide;

import com.webtourguide.exception.ResourceNotFoundException;
import com.webtourguide.tourguide.dto.*;
import com.webtourguide.tourguide.ranking.GuideRankingContext;
import com.webtourguide.tourguide.ranking.GuideRankingStrategy;
import com.webtourguide.user.Role;
import com.webtourguide.user.User;
import com.webtourguide.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Business-logic layer for the Tour Guide Management module.
 * Access rules: public read; ADMIN/STAFF create+delete; owner or ADMIN for edits.
 */
@Service
public class TourGuideService {

    private static final Logger log = LoggerFactory.getLogger(TourGuideService.class);

    private final TourGuideRepository repository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /** Strategy Pattern: all guide ranking strategies, keyed by type ("rating", ...). */
    private final Map<String, GuideRankingStrategy> rankingStrategies;

    public TourGuideService(TourGuideRepository repository, UserRepository userRepository,
                             PasswordEncoder passwordEncoder, List<GuideRankingStrategy> rankingStrategies) {
        this.repository = repository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.rankingStrategies = rankingStrategies.stream()
                .collect(Collectors.toMap(GuideRankingStrategy::getType, Function.identity()));
    }

    public List<TourGuideResponse> getAll() {
        log.debug("Fetching all tour guides");
        return repository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public TourGuideResponse getById(Long id) {
        log.debug("Fetching tour guide id={}", id);
        return toResponse(findEntity(id));
    }

    public List<TourGuideResponse> getAvailable() {
        log.debug("Fetching available tour guides");
        return repository.findByIsAvailableTrue().stream().map(this::toResponse).collect(Collectors.toList());
    }

    /**
     * Returns guides ranked by the strategy named in {@code by}
     * ("rating", "experience" or "languages"), chosen at runtime.
     */
    public List<TourGuideResponse> getRanked(String by, boolean availableOnly) {
        log.debug("Ranking tour guides by '{}' (availableOnly={})", by, availableOnly);
        GuideRankingStrategy strategy = rankingStrategies.get(by == null ? "rating" : by.trim().toLowerCase());
        if (strategy == null)
            throw new IllegalStateException("Unknown ranking '" + by + "'. Allowed: " + rankingStrategies.keySet());
        List<TourGuide> guides = availableOnly ? repository.findByIsAvailableTrue() : repository.findAll();
        return new GuideRankingContext(strategy).rank(guides)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<TourGuideResponse> searchByLanguage(String language) {
        log.debug("Searching tour guides by language='{}'", language);
        return repository.findByLanguagesContainingIgnoreCase(language)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<TourGuideResponse> searchByLocation(String location) {
        log.debug("Searching tour guides by location='{}'", location);
        return repository.findByLocationContainingIgnoreCase(location)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    /**
     * Returns TOUR_GUIDE-role users who do not yet have a guide profile,
     * for the ADMIN/STAFF "link user" picker on the guide-creation form.
     */
    public List<EligibleUserResponse> getEligibleUsers() {
        log.debug("Fetching users eligible to become guide profiles");
        return userRepository.findByRole(Role.TOUR_GUIDE).stream()
                .filter(u -> !repository.existsByUserId(u.getId()))
                .map(u -> EligibleUserResponse.builder()
                        .id(u.getId()).fullName(u.getFullName()).email(u.getEmail()).build())
                .collect(Collectors.toList());
    }

    @Transactional
    public TourGuideResponse create(TourGuideCreateRequest req) {
        log.info("Creating guide profile for userId={}", req.getUserId());
        User user = userRepository.findById(req.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User " + req.getUserId() + " not found"));
        if (user.getRole() != Role.TOUR_GUIDE)
            throw new IllegalStateException("User must have role TOUR_GUIDE before a guide profile can be created");
        if (repository.existsByUserId(user.getId()))
            throw new IllegalStateException("This user already has a guide profile");
        TourGuide guide = TourGuide.builder()
                .user(user).languages(req.getLanguages()).skills(req.getSkills())
                .certifications(req.getCertifications()).location(req.getLocation())
                .yearsExperience(req.getYearsExperience() == null ? 0 : req.getYearsExperience())
                .isAvailable(true).rating(0.0).build();
        TourGuideResponse saved = toResponse(repository.save(guide));
        log.info("Guide profile created: id={}", saved.getId());
        return saved;
    }

    /**
     * Creates a brand-new user account (role {@code TOUR_GUIDE}) plus its linked
     * guide profile in one step, so the guide can log in right away with the
     * given email/password (ADMIN / STAFF only).
     */
    @Transactional
    public TourGuideResponse registerNewGuide(TourGuideRegisterRequest req) {
        log.info("Registering new guide account for email='{}'", req.getEmail());
        if (userRepository.existsByEmail(req.getEmail()))
            throw new IllegalStateException("Email already registered");
        User user = User.builder()
                .fullName(req.getFullName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .phone(req.getPhone())
                .role(Role.TOUR_GUIDE)
                .build();
        user = userRepository.save(user);
        TourGuide guide = TourGuide.builder()
                .user(user).languages(req.getLanguages()).skills(req.getSkills())
                .certifications(req.getCertifications()).location(req.getLocation())
                .yearsExperience(req.getYearsExperience() == null ? 0 : req.getYearsExperience())
                .isAvailable(true).rating(0.0).build();
        TourGuideResponse saved = toResponse(repository.save(guide));
        log.info("Guide account created: userId={}, guideId={}", user.getId(), saved.getId());
        return saved;
    }

    /**
     * Creates a guide profile for a user that has already been promoted to TOUR_GUIDE
     * (used by {@code GuideApplicationService} when an admin approves an application).
     */
    @Transactional
    public TourGuideResponse createProfileForUser(User user, String languages, String skills,
                                                    String certifications, String location,
                                                    Integer yearsExperience) {
        if (repository.existsByUserId(user.getId()))
            throw new IllegalStateException("This user already has a guide profile");
        TourGuide guide = TourGuide.builder()
                .user(user).languages(languages).skills(skills)
                .certifications(certifications).location(location)
                .yearsExperience(yearsExperience == null ? 0 : yearsExperience)
                .isAvailable(true).rating(0.0).build();
        TourGuideResponse saved = toResponse(repository.save(guide));
        log.info("Guide profile created via application approval: id={}", saved.getId());
        return saved;
    }

    @Transactional
    public TourGuideResponse updateProfile(Long id, TourGuideUpdateRequest req, Authentication auth) {
        log.info("Updating profile for guide id={} by '{}'", id, auth.getName());
        TourGuide guide = findEntity(id);
        assertOwnerOrAdmin(guide, auth);
        if (req.getLanguages() != null) guide.setLanguages(req.getLanguages());
        if (req.getSkills() != null) guide.setSkills(req.getSkills());
        if (req.getCertifications() != null) guide.setCertifications(req.getCertifications());
        if (req.getLocation() != null) guide.setLocation(req.getLocation());
        if (req.getYearsExperience() != null) guide.setYearsExperience(req.getYearsExperience());
        return toResponse(repository.save(guide));
    }

    @Transactional
    public TourGuideResponse updateAvailability(Long id, AvailabilityUpdateRequest req, Authentication auth) {
        log.info("Updating availability for guide id={} to {} by '{}'", id, req.getIsAvailable(), auth.getName());
        TourGuide guide = findEntity(id);
        assertOwnerOrAdmin(guide, auth);
        guide.setIsAvailable(req.getIsAvailable());
        return toResponse(repository.save(guide));
    }

    @Transactional
    public void delete(Long id) {
        log.info("Deleting guide profile id={}", id);
        if (!repository.existsById(id))
            throw new ResourceNotFoundException("Tour guide " + id + " not found");
        long bookings = repository.countBookings(id);
        if (bookings > 0)
            throw new IllegalStateException("Cannot delete this guide: " + bookings
                    + " booking(s) are assigned to them. Mark the guide unavailable instead.");
        repository.deleteById(id);
    }

    private void assertOwnerOrAdmin(TourGuide guide, Authentication auth) {
        boolean isAdmin = auth.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
        if (isAdmin) return;
        String email = auth.getName();
        if (!guide.getUser().getEmail().equalsIgnoreCase(email)) {
            log.warn("Access denied: '{}' tried to modify guide id={}", email, guide.getId());
            throw new AccessDeniedException("You can only edit your own guide profile");
        }
    }

    private TourGuide findEntity(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tour guide " + id + " not found"));
    }

    private TourGuideResponse toResponse(TourGuide g) {
        return TourGuideResponse.builder()
                .id(g.getId()).userId(g.getUser().getId())
                .fullName(g.getUser().getFullName()).email(g.getUser().getEmail())
                .languages(g.getLanguages()).skills(g.getSkills())
                .certifications(g.getCertifications()).location(g.getLocation())
                .yearsExperience(g.getYearsExperience())
                .isAvailable(g.getIsAvailable()).rating(g.getRating()).build();
    }
}