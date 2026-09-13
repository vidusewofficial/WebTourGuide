package com.webtourguide.booking.dto;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;

@Data
public class RescheduleRequest {
    @NotNull @FutureOrPresent private LocalDate newBookingDate;
}
