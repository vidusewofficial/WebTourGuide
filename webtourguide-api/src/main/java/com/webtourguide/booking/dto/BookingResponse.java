package com.webtourguide.booking.dto;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data @Builder
public class BookingResponse {
    private Long id;
    private Long touristId;
    private String touristName;
    private Long packageId;
    private String packageTitle;
    private Long guideId;
    private String guideName;
    private LocalDate bookingDate;
    private Integer participants;
    private String status;
    private BigDecimal totalPrice;
    private LocalDateTime createdAt;
}
