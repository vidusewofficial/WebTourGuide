package com.webtourguide.tripplan;

import com.webtourguide.user.User;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.*;

@Entity
@Table(name = "trip_plans")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TripPlan {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne @JoinColumn(name = "tourist_id", nullable = false)
    private User tourist;

    private String title;

    @Column(name = "start_date") private LocalDate startDate;
    @Column(name = "end_date")   private LocalDate endDate;

    @OneToMany(mappedBy = "tripPlan", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<TripPlanItem> items = new ArrayList<>();
}
