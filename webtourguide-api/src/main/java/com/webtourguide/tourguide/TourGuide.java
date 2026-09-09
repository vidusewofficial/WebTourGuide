package com.webtourguide.tourguide;

import com.webtourguide.user.User;
import jakarta.persistence.*;
import lombok.*;

/**
 * JPA entity representing a tour-guide profile.
 * Each profile is linked one-to-one with a {@link com.webtourguide.user.User}
 * whose role must be {@code TOUR_GUIDE}.
 * Maps to the {@code tour_guides} table.
 */
@Entity
@Table(name = "tour_guides")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TourGuide {

    /** Auto-generated primary key. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * The user account associated with this guide profile.
     * Must have role {@code TOUR_GUIDE}.
     */
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    /** Comma-separated list of languages spoken, e.g. "English, Sinhala, Tamil". */
    @Column(length = 300)
    private String languages;

    /** Comma-separated skills, e.g. "Wildlife tours, hiking". */
    @Column(length = 300)
    private String skills;

    /** Comma-separated certifications, e.g. "SLTDA Licensed Guide, First Aid". */
    @Column(length = 300)
    private String certifications;

    /** Total years of guiding experience. Defaults to 0 on creation. */
    @Column(name = "years_experience")
    private Integer yearsExperience;

    /**
     * Whether the guide is currently accepting bookings.
     * Defaults to {@code true} on profile creation.
     */
    @Column(name = "is_available")
    private Boolean isAvailable;

    /** Average guest rating (0.0–5.0). Defaults to 0.0 on creation. */
    private Double rating;
}