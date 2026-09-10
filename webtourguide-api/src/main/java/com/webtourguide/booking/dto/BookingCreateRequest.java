package com.webtourguide.booking.dto;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;

@Data
public class BookingCreateRequest {
    @NotNull private Long packageId;
    private Long guideId;             // optional — a booking can be package-only
    @NotNull @FutureOrPresent private LocalDate bookingDate;
    @NotNull @Min(1) private Integer participants;
}
