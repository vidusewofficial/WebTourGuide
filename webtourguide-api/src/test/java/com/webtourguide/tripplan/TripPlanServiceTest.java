package com.webtourguide.tripplan;

import org.junit.jupiter.api.Test;

/**
 * Unit tests for TripPlanService.
 *
 * TODO: implement the following tests:
 *   - create() saves a new plan and returns a response with the correct title
 *   - create() throws IllegalStateException when startDate is after endDate
 *   - getMy() returns only plans belonging to the authenticated tourist
 *   - getById() throws ResourceNotFoundException when plan does not exist
 *   - getById() throws AccessDeniedException when plan belongs to a different tourist
 *   - update() clears existing items and rebuilds the list from the request
 *   - update() throws ResourceNotFoundException when a referenced destination does not exist
 *   - delete() removes the plan from the repository
 *   - delete() throws AccessDeniedException when plan belongs to a different tourist
 */
class TripPlanServiceTest {

    @Test
    void placeholder_test_so_the_class_compiles() {
        // This test intentionally does nothing.
        // Replace it with real tests using @ExtendWith(MockitoExtension.class).
    }
}
