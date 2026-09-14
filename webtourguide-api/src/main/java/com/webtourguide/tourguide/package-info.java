/**
 * Tour Guide Management module for the WebTourGuide application.
 *
 * <p>This package contains:
 * <ul>
 *   <li>{@link com.webtourguide.tourguide.TourGuide} – JPA entity mapped to {@code tour_guides}</li>
 *   <li>{@link com.webtourguide.tourguide.TourGuideRepository} – Spring Data JPA repository</li>
 *   <li>{@link com.webtourguide.tourguide.TourGuideService} – business logic and access control</li>
 *   <li>{@link com.webtourguide.tourguide.TourGuideController} – REST controller at /api/guides</li>
 * </ul>
 *
 * <p>DTOs live in the {@code com.webtourguide.tourguide.dto} sub-package.
 */
package com.webtourguide.tourguide;