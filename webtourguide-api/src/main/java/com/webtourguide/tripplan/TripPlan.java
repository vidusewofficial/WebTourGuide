package com.webtourguide.tripplan;

import com.webtourguide.user.User;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

/**
 * Represents a personal trip itinerary created by a tourist.
 * A plan has a title, optional start/end dates, and a list of day items.
 * Ownership is enforced in the service — only the tourist who created
 * the plan may view, edit, or delete it.
 */
@Entity
@Table(name = "trip_plans")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@ToString(exclude = "items")
public class TripPlan {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** The tourist who owns this plan. */
    @ManyToOne @JoinColumn(name = "tourist_id", nullable = false)
    private User tourist;

    /** Name of the trip (e.g. "South Coast Getaway"). */
    private String title;

    @Column(name = "start_date") private LocalDate startDate;
    @Column(name = "end_date")   private LocalDate endDate;

    /** When this plan was first created. Set automatically on insert. */
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    /**
     * Day-by-day items in this plan.
     * cascade=ALL and orphanRemoval=true mean Hibernate manages inserts
     * and deletes automatically when you call repository.save(plan).
     */
    @OneToMany(mappedBy = "tripPlan", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<TripPlanItem> items = new ArrayList<>();

    /** Automatically sets createdAt before the first insert. */
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
