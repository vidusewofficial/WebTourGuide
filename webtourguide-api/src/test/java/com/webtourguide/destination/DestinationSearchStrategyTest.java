package com.webtourguide.destination;

import com.webtourguide.destination.dto.DestinationResponse;
import com.webtourguide.destination.search.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DestinationSearchStrategyTest {

    @Mock private DestinationRepository repository;

    private NameSearchStrategy byName;
    private LocationSearchStrategy byLocation;
    private CategorySearchStrategy byCategory;
    private AnyFieldSearchStrategy byAny;
    private DestinationService service;

    private final Destination sigiriya = Destination.builder()
            .id(1L).name("Sigiriya Rock").category("Historical").location("Matale").build();
    private final Destination unawatuna = Destination.builder()
            .id(2L).name("Unawatuna Beach").category("Beach").location("Galle").build();

    @BeforeEach
    void setUp() {
        byName = new NameSearchStrategy(repository);
        byLocation = new LocationSearchStrategy(repository);
        byCategory = new CategorySearchStrategy(repository);
        byAny = new AnyFieldSearchStrategy(repository);
        service = new DestinationService(repository, List.of(byName, byLocation, byCategory, byAny));
    }

    @Test
    void contextDelegatesToCurrentStrategyAndCanSwitchAtRuntime() {
        when(repository.findByNameContainingIgnoreCase("rock")).thenReturn(List.of(sigiriya));
        when(repository.findByLocationContainingIgnoreCase("galle")).thenReturn(List.of(unawatuna));

        DestinationSearchContext context = new DestinationSearchContext(byName);
        assertThat(context.executeSearch("rock")).containsExactly(sigiriya);

        context.setStrategy(byLocation);
        assertThat(context.executeSearch("galle")).containsExactly(unawatuna);
        verify(repository, never()).findByNameContainingIgnoreCase("galle");
    }

    @Test
    void serviceSelectsStrategyFromSearchType() {
        when(repository.findByLocationContainingIgnoreCase("galle")).thenReturn(List.of(unawatuna));

        List<DestinationResponse> result = service.search("galle", "LOCATION");

        assertThat(result).extracting(DestinationResponse::getName).containsExactly("Unawatuna Beach");
    }

    @Test
    void anyFieldStrategySearchesNameLocationAndCategory() {
        when(repository.findByNameContainingIgnoreCaseOrLocationContainingIgnoreCaseOrCategoryContainingIgnoreCase(
                "beach", "beach", "beach")).thenReturn(List.of(unawatuna));

        assertThat(service.search("beach", "any")).hasSize(1);
    }

    @Test
    void filterByCategoryUsesCategoryStrategy() {
        when(repository.findByCategoryIgnoreCase("Historical")).thenReturn(List.of(sigiriya));

        assertThat(service.filterByCategory("Historical"))
                .extracting(DestinationResponse::getId).containsExactly(1L);
    }

    @Test
    void unknownSearchTypeIsRejected() {
        assertThatThrownBy(() -> service.search("x", "price"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Unknown search type");
    }
}
