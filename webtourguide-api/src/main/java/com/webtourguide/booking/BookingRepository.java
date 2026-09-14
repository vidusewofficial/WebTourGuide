package com.webtourguide.booking;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByTouristId(Long touristId);
    List<Booking> findByStatus(BookingStatus status);
    List<Booking> findByGuideId(Long guideId);
}
