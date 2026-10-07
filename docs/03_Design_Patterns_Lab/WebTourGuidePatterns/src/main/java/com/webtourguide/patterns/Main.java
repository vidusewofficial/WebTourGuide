package com.webtourguide.patterns;

import com.webtourguide.patterns.booking.Booking;
import com.webtourguide.patterns.destination.*;
import com.webtourguide.patterns.model.*;
import com.webtourguide.patterns.support.*;
import com.webtourguide.patterns.tourguide.*;
import com.webtourguide.patterns.tourpackage.*;
import com.webtourguide.patterns.tripplan.*;

import java.time.LocalDate;
import java.util.List;

/**
 * MAIN CLASS - WebTourGuide, IT2020 Lab 06 (Design Patterns).
 *
 * Demonstrates the design patterns used in the WebTourGuide web application,
 * one per module, using sample data:
 *   1. Strategy - destination search
 *   2. Strategy - tour package sorting
 *   3. Strategy - tour guide ranking
 *   4. Strategy - trip plan export
 *   5. State    - booking lifecycle
 *   6. Observer - support ticket status changes
 */
public class Main {

    public static void main(String[] args) {
        System.out.println("WebTourGuide - Design Patterns Demo (IT2020 Lab 06)");

        List<Destination> destinations = List.of(
                new Destination(1L, "Mirissa Beach", "Beach", "Matara"),
                new Destination(2L, "Sigiriya Rock", "Historical", "Dambulla"),
                new Destination(3L, "Ella Rock", "Mountain", "Badulla"),
                new Destination(4L, "Unawatuna Bay", "Beach", "Galle"),
                new Destination(5L, "Temple of the Tooth", "Historical", "Kandy"));

        demoDestinationSearch(destinations);
        demoPackageSorting();
        demoGuideRanking();
        demoTripPlanExport(destinations);
        demoBookingState();
        demoSupportObserver();
    }

    /** 1. Strategy Pattern - the same context switches search strategy at runtime. */
    private static void demoDestinationSearch(List<Destination> destinations) {
        heading("1. STRATEGY - Destination search");
        DestinationRepository repository = new DestinationRepository(destinations);

        DestinationSearchContext context =
                new DestinationSearchContext(new NameSearchStrategy(repository));
        printSearch(context, "rock");

        // switch the strategy at runtime - same context, new behaviour
        context.setStrategy(new LocationSearchStrategy(repository));
        printSearch(context, "galle");

        context.setStrategy(new CategorySearchStrategy(repository));
        printSearch(context, "historical");

        context.setStrategy(new AnyFieldSearchStrategy(repository));
        printSearch(context, "beach");
    }

    private static void printSearch(DestinationSearchContext context, String keyword) {
        String type = context.getStrategy().getType();
        System.out.println("Search by '" + type + "' for \"" + keyword + "\":");
        context.executeSearch(keyword).forEach(d -> System.out.println("   - " + d));
    }

    /** 2. Strategy Pattern - one list of packages, four different orderings. */
    private static void demoPackageSorting() {
        heading("2. STRATEGY - Tour package sorting");
        List<TourPackage> packages = List.of(
                new TourPackage(1L, "Southern Coast Escape", 4, 320.00, LocalDate.of(2026, 8, 1)),
                new TourPackage(2L, "Cultural Triangle Tour", 6, 540.00, LocalDate.of(2026, 9, 12)),
                new TourPackage(3L, "Ella Hiking Weekend", 2, 150.00, LocalDate.of(2026, 7, 20)),
                new TourPackage(4L, "Kandy City Day Trip", 1, 75.00, LocalDate.of(2026, 9, 30)));

        PackageSortContext context = new PackageSortContext(new PriceLowToHighSort());
        for (PackageSortStrategy strategy : List.of(new PriceLowToHighSort(), new PriceHighToLowSort(),
                new ShortestDurationSort(), new NewestFirstSort())) {
            context.setStrategy(strategy);                              // switch at runtime
            System.out.println("Sorted by '" + strategy.getType() + "':");
            context.sort(packages).forEach(p -> System.out.println("   " + p));
        }
    }

    /** 3. Strategy Pattern - rank the same guides three different ways. */
    private static void demoGuideRanking() {
        heading("3. STRATEGY - Tour guide ranking");
        List<TourGuide> guides = List.of(
                new TourGuide("Kasun Perera", "English, Sinhala", 4, 4.5),
                new TourGuide("Nimal Silva", "English, Tamil", 2, 4.2),
                new TourGuide("Amara Fernando", "English, Sinhala, Tamil", 7, 4.8),
                new TourGuide("Ruwan Jayasuriya", "English, German, French, Sinhala", 5, 4.4));

        GuideRankingContext context = new GuideRankingContext(new RatingRankingStrategy());
        for (GuideRankingStrategy strategy : List.of(new RatingRankingStrategy(),
                new ExperienceRankingStrategy(), new LanguageCountRankingStrategy())) {
            context.setStrategy(strategy);                              // switch at runtime
            System.out.println("Ranked by '" + strategy.getType() + "':");
            List<TourGuide> ranked = context.rank(guides);
            for (int i = 0; i < ranked.size(); i++) {
                System.out.println("   " + (i + 1) + ". " + ranked.get(i));
            }
        }
    }

    /** 4. Strategy Pattern - export one trip plan in three file formats. */
    private static void demoTripPlanExport(List<Destination> destinations) {
        heading("4. STRATEGY - Trip plan export");
        TripPlan plan = new TripPlan(7L, "Hill Country Weekend", LocalDate.of(2026, 12, 5), List.of(
                new TripPlanItem(1, destinations.get(4), "Kandy Guest House", "Temple visit"),
                new TripPlanItem(2, destinations.get(2), "Ella Flower Garden Resort", "Hiking, Nine Arch Bridge"),
                new TripPlanItem(3, null, null, null)));

        TripPlanExporter exporter = new TripPlanExporter(new PlainTextExportStrategy());
        for (TripPlanExportStrategy strategy : List.of(new PlainTextExportStrategy(),
                new CsvExportStrategy(), new CalendarExportStrategy())) {
            exporter.setStrategy(strategy);                             // switch at runtime
            System.out.println("--- " + exporter.fileName(plan) + " (format '" + strategy.getFormat() + "') ---");
            System.out.print(exporter.export(plan));
        }
    }

    /** 5. State Pattern - the booking's current state decides which actions are allowed. */
    private static void demoBookingState() {
        heading("5. STATE - Booking lifecycle");
        Booking booking = new Booking(101L, "Southern Coast Escape", LocalDate.of(2026, 11, 10));
        System.out.println("Created:      " + booking);

        booking.confirm();
        System.out.println("confirm():    " + booking);

        booking.reschedule(LocalDate.of(2026, 11, 20));
        System.out.println("reschedule(): " + booking);

        booking.confirm();
        System.out.println("confirm():    " + booking);

        booking.complete();
        System.out.println("complete():   " + booking);

        // A completed booking is a final state - the state object rejects the action.
        try {
            booking.cancel();
        } catch (IllegalStateException ex) {
            System.out.println("cancel():     rejected -> " + ex.getMessage());
        }
    }

    /** 6. Observer Pattern - one status change notifies every registered observer. */
    private static void demoSupportObserver() {
        heading("6. OBSERVER - Support ticket status changes");
        SupportTicketService service = new SupportTicketService();
        service.addObserver(new TicketAuditLogObserver());
        service.addObserver(new BookingCancellationObserver());

        Booking booking = new Booking(202L, "Ella Hiking Weekend", LocalDate.of(2026, 12, 1));
        SupportTicket ticket = new SupportTicket(55L, TicketType.CANCELLATION_REQUEST,
                "Please cancel my booking", booking);
        System.out.println("Before: " + booking);

        System.out.println("Staff moves ticket #55 to IN_PROGRESS:");
        service.updateStatus(ticket, TicketStatus.IN_PROGRESS, "staff@webtourguide.com");

        System.out.println("Staff moves ticket #55 to RESOLVED:");
        service.updateStatus(ticket, TicketStatus.RESOLVED, "staff@webtourguide.com");
        System.out.println("After:  " + booking);
    }

    private static void heading(String title) {
        System.out.println();
        System.out.println("==============================================================");
        System.out.println(" " + title);
        System.out.println("==============================================================");
    }
}
