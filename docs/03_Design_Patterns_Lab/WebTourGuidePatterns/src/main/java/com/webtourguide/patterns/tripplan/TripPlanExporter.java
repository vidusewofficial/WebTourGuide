package com.webtourguide.patterns.tripplan;

import com.webtourguide.patterns.model.TripPlan;

/**
 * CONTEXT CLASS (Strategy Pattern): exports a trip plan with whichever
 * format strategy it currently holds.
 */
public class TripPlanExporter {

    private TripPlanExportStrategy strategy;

    public TripPlanExporter(TripPlanExportStrategy strategy) {
        this.strategy = strategy;
    }

    /** Switches the export format at runtime. */
    public void setStrategy(TripPlanExportStrategy strategy) {
        this.strategy = strategy;
    }

    public String fileName(TripPlan plan) {
        return "trip-plan-" + plan.getId() + "." + strategy.getFileExtension();
    }

    public String export(TripPlan plan) {
        return strategy.export(plan);
    }
}
