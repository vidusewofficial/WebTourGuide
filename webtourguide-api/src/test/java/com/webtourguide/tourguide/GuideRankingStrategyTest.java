package com.webtourguide.tourguide;

import com.webtourguide.tourguide.dto.TourGuideResponse;
import com.webtourguide.tourguide.ranking.*;
import com.webtourguide.user.User;
import com.webtourguide.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class GuideRankingStrategyTest {

    @Mock private TourGuideRepository repository;
    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;

    private TourGuideService service;

    // Nimal: best rated. Kamala: most experienced. Ravi: speaks the most languages.
    private final TourGuide nimal = guide(1L, "Nimal", 4.9, 3, "English");
    private final TourGuide kamala = guide(2L, "Kamala", 4.2, 12, "English, Sinhala");
    private final TourGuide ravi = guide(3L, "Ravi", 3.8, 5, "English, Sinhala, Tamil, German");

    private static TourGuide guide(Long id, String name, double rating, int years, String languages) {
        User user = User.builder().id(id + 100).fullName(name).email(name.toLowerCase() + "@example.com").build();
        return TourGuide.builder().id(id).user(user).rating(rating)
                .yearsExperience(years).languages(languages).isAvailable(true).build();
    }

    @BeforeEach
    void setUp() {
        service = new TourGuideService(repository, userRepository, passwordEncoder, List.of(
                new RatingRankingStrategy(), new ExperienceRankingStrategy(), new LanguageCountRankingStrategy()));
    }

    @Test
    void contextRanksDifferentlyWhenStrategyIsSwitchedAtRuntime() {
        List<TourGuide> guides = List.of(kamala, ravi, nimal);
        GuideRankingContext context = new GuideRankingContext(new RatingRankingStrategy());
        assertThat(context.rank(guides)).first().isEqualTo(nimal);

        context.setStrategy(new ExperienceRankingStrategy());
        assertThat(context.rank(guides)).first().isEqualTo(kamala);

        context.setStrategy(new LanguageCountRankingStrategy());
        assertThat(context.rank(guides)).first().isEqualTo(ravi);
    }

    @Test
    void serviceRanksAvailableGuidesByChosenStrategy() {
        when(repository.findByIsAvailableTrue()).thenReturn(List.of(nimal, kamala, ravi));

        List<TourGuideResponse> ranked = service.getRanked("experience", true);

        assertThat(ranked).extracting(TourGuideResponse::getFullName)
                .containsExactly("Kamala", "Ravi", "Nimal");
    }

    @Test
    void unknownRankingIsRejected() {
        assertThatThrownBy(() -> service.getRanked("price", false))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Unknown ranking");
    }
}
