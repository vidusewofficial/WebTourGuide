package com.webtourguide.tourpackage;

import com.webtourguide.destination.Destination;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "tour_packages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TourPackage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "destination_id", nullable = false)
    private Destination destination;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "duration_days")
    private Integer durationDays;

    private BigDecimal price;

    @Column(name = "max_participants")
    private Integer maxParticipants;

    private Boolean active;

    @Column(name = "image_url")
    private String imageUrl;

    @ElementCollection
    @CollectionTable(name = "tour_package_gallery", joinColumns = @JoinColumn(name = "package_id"))
    @Column(name = "image_url")
    private List<String> galleryUrls;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        if (this.active == null) this.active = true;
        if (this.maxParticipants == null) this.maxParticipants = 10;
    }
}
