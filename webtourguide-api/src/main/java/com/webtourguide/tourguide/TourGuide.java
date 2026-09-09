package com.webtourguide.tourguide;

import com.webtourguide.user.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tour_guides")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TourGuide {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private String languages;      // comma-separated e.g. "English, Sinhala, Tamil"
    private String skills;
    private String certifications;

    @Column(name = "years_experience")
    private Integer yearsExperience;

    @Column(name = "is_available")
    private Boolean isAvailable;

    private Double rating;
}