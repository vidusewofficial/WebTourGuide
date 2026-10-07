package com.webtourguide.guideapplication;

import com.webtourguide.user.User;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * A TOURIST's application to become a tour guide. On approval, the linked
 * {@link User} is promoted to {@code TOUR_GUIDE} and a {@code TourGuide}
 * profile is created from the fields captured here.
 */
@Entity
@Table(name = "guide_applications")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class GuideApplication {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne @JoinColumn(name = "applicant_id", nullable = false)
    private User applicant;

    @Column(length = 300)
    private String languages;

    @Column(length = 300)
    private String skills;

    @Column(length = 300)
    private String certifications;

    @Column(length = 150)
    private String location;

    @Column(name = "years_experience")
    private Integer yearsExperience;

    @Column(length = 1000)
    private String message;

    @Enumerated(EnumType.STRING)
    private ApplicationStatus status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @Column(name = "review_note", length = 500)
    private String reviewNote;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) this.status = ApplicationStatus.PENDING;
    }
}
