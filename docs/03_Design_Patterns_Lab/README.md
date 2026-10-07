# IT2020 Lab 06 – Design Patterns (WebTourGuide)

Group: **Y2-S1-MLB-B2G2-03**

| File / folder | What it is |
|---|---|
| `Lab06_DesignPatterns_Report_WebTourGuide.docx` | The report (group details, patterns used, justification, screenshots, code files) |
| `Lab06_DesignPatterns_Report_WebTourGuide.pdf` | PDF copy of the report |
| `WebTourGuidePatterns/` | Standalone Java 17 project (NetBeans / Maven) demonstrating every pattern |
| `screenshots/` | The code and output images used in the report |

## Patterns

| Module | Pattern | Package |
|---|---|---|
| Destination Management | Strategy – destination search | `destination` |
| Tour Package Management | Strategy – package sorting | `tourpackage` |
| Tour Guide Management | Strategy – guide ranking | `tourguide` |
| Trip Planning Management | Strategy – trip plan export | `tripplan` |
| Booking Management | State – booking lifecycle | `booking` |
| Customer Support Management | Observer – ticket status changes | `support` |

## Run it

**NetBeans:** File → Open Project → select `WebTourGuidePatterns` → right-click → Run
(or open `Main.java` and press Shift+F6).

**Command line** (from `WebTourGuidePatterns/`):

```
mvn compile exec:java
```

or without Maven:

```
javac -d out $(find src -name "*.java")
java -cp out com.webtourguide.patterns.Main
```

The full web application uses the same classes as Spring components under
`webtourguide-api/src/main/java/com/webtourguide/` (`destination/search`,
`tourpackage/sorting`, `tourguide/ranking`, `tripplan/export`, `booking/state`,
`support/observer`).
