package com.webtourguide.tourpackage;

import org.springframework.data.jpa.repository.JpaRepository;
import java.math.BigDecimal;
import java.util.List;

public interface TourPackageRepository extends JpaRepository<TourPackage, Long> {
    List<TourPackage> findByDestinationId(Long destinationId);
    List<TourPackage> findByPriceBetween(BigDecimal min, BigDecimal max);
    List<TourPackage> findByActiveTrue();
    List<TourPackage> findByIdIn(List<Long> ids);
    List<TourPackage> findByTitleContainingIgnoreCase(String title);
}
