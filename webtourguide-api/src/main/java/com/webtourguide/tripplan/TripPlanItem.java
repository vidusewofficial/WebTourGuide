package com.webtourguide.tripplan;

import com.webtourguide.destination.Destination;
import jakarta.persistence.*;
import lombok.*;

/**
 * Represents a single day entry inside a TripPlan.
 * Each item belongs to one plan and optionally references a destination.
 */
@Entity
@Table(name = "trip_plan_items")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@ToString(exclude = "tripPlan")
public class TripPlanItem {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** The parent trip plan this item belongs to. */
    @ManyToOne @JoinColumn(name = "trip_plan_id", nullable = false)
    private TripPlan tripPlan;

    /** Optional destination for this day (null means a rest day). */
    @ManyToOne @JoinColumn(name = "destination_id")
    private Destination destination;

    /** Which day in the itinerary this entry falls on (1-based). */
    @Column(name = "day_number", nullable = false)
    private Integer dayNumber;

    /** Name of accommodation for this day. */
    private String accommodation;

    /** Mode of transportation for this day. */
    private String transportation;

    /** Free-form notes for this day. */
    private String notes;
}
