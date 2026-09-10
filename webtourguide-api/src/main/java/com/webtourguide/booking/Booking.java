package com.webtourguide.booking;

import com.webtourguide.tourguide.TourGuide;
import com.webtourguide.tourpackage.TourPackage;
import com.webtourguide.user.User;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Booking {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne @JoinColumn(name = "tourist_id", nullable = false)
    private User tourist;

    @ManyToOne @JoinColumn(name = "package_id")
    private TourPackage tourPackage;

    @ManyToOne @JoinColumn(name = "guide_id")
    private TourGuide guide;

    @Column(name = "booking_date", nullable = false)
    private LocalDate bookingDate;

    private Integer participants;

    @Enumerated(EnumType.STRING)
    private BookingStatus status;

    @Column(name = "total_price")
    private BigDecimal totalPrice;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) this.status = BookingStatus.PENDING;
    }
}
