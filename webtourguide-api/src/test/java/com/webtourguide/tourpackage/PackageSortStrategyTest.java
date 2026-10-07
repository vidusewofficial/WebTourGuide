package com.webtourguide.tourpackage;

import com.webtourguide.destination.Destination;
import com.webtourguide.destination.DestinationRepository;
import com.webtourguide.tourpackage.dto.TourPackageResponse;
import com.webtourguide.tourpackage.sorting.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PackageSortStrategyTest {

    @Mock private TourPackageRepository repository;
    @Mock private DestinationRepository destinationRepository;

    private TourPackageService service;

    private final Destination ella = Destination.builder().id(1L).name("Ella").build();
    private final TourPackage hillTrek = pkg(1L, "Hill Trek", "45000", 4, LocalDateTime.of(2026, 9, 1, 9, 0));
    private final TourPackage dayTour = pkg(2L, "Day Tour", "8000", 1, LocalDateTime.of(2026, 9, 20, 9, 0));
    private final TourPackage grandTour = pkg(3L, "Grand Tour", "120000", 7, LocalDateTime.of(2026, 8, 1, 9, 0));

    private TourPackage pkg(Long id, String title, String price, int days, LocalDateTime createdAt) {
        return TourPackage.builder().id(id).destination(ella).title(title).price(new BigDecimal(price))
                .durationDays(days).createdAt(createdAt).active(true).build();
    }

    @BeforeEach
    void setUp() {
        service = new TourPackageService(repository, destinationRepository, List.of(
                new PriceLowToHighSort(), new PriceHighToLowSort(), new ShortestDurationSort(), new NewestFirstSort()));
    }

    @Test
    void contextSortsDifferentlyWhenStrategyIsSwitchedAtRuntime() {
        List<TourPackage> packages = List.of(hillTrek, dayTour, grandTour);
        PackageSortContext context = new PackageSortContext(new PriceLowToHighSort());
        assertThat(context.sort(packages)).containsExactly(dayTour, hillTrek, grandTour);

        context.setStrategy(new PriceHighToLowSort());
        assertThat(context.sort(packages)).containsExactly(grandTour, hillTrek, dayTour);

        context.setStrategy(new NewestFirstSort());
        assertThat(context.sort(packages)).containsExactly(dayTour, hillTrek, grandTour);
    }

    @Test
    void serviceSortsActivePackagesByChosenStrategy() {
        when(repository.findByActiveTrue()).thenReturn(List.of(grandTour, hillTrek, dayTour));

        List<TourPackageResponse> sorted = service.getAllActive("duration");

        assertThat(sorted).extracting(TourPackageResponse::getTitle)
                .containsExactly("Day Tour", "Hill Trek", "Grand Tour");
    }

    @Test
    void unknownSortIsRejected() {
        assertThatThrownBy(() -> service.getAllActive("rating"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Unknown sort");
    }
}
