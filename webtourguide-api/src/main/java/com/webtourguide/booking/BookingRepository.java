package com.webtourguide.booking;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByTouristId(Long touristId);
    List<Booking> findByStatus(BookingStatus status);
    List<Booking> findByGuideId(Long guideId);
    boolean existsByTouristId(Long touristId);
    long countByGuideId(Long guideId);

    /** Unlinks support tickets from this booking (the tickets are kept) so it can be deleted. */
    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("update SupportTicket t set t.booking = null where t.booking.id = :id")
    int detachFromSupportTickets(@Param("id") Long id);
}
