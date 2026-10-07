package com.webtourguide.tripplan.export;

import com.webtourguide.tripplan.TripPlan;

/**
 * Context class (Strategy Pattern): exports a trip plan with whichever
 * format strategy it currently holds. Created per request, never shared.
 */
public class TripPlanExporter {

    private TripPlanExportStrategy strategy;

    public TripPlanExporter(TripPlanExportStrategy strategy) {
        this.strategy = strategy;
    }

    public void setStrategy(TripPlanExportStrategy strategy) {
        this.strategy = strategy;
    }

    public TripPlanExportStrategy getStrategy() {
        return strategy;
    }

    public String export(TripPlan plan) {
        return strategy.export(plan);
    }
}
