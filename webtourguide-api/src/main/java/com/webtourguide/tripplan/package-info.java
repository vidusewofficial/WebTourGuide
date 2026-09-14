/**
 * Trip Planning module — allows TOURIST users to create personal
 * multi-day itineraries, add destinations to specific days, attach
 * accommodation and transportation notes, and manage their plans.
 *
 * <p>Key classes:
 * <ul>
 *   <li>{@link com.webtourguide.tripplan.TripPlan} — the top-level itinerary entity</li>
 *   <li>{@link com.webtourguide.tripplan.TripPlanItem} — a single day entry</li>
 *   <li>{@link com.webtourguide.tripplan.TripPlanService} — business logic and ownership rules</li>
 *   <li>{@link com.webtourguide.tripplan.TripPlanController} — REST API at /api/trip-plans</li>
 * </ul>
 */
package com.webtourguide.tripplan;
