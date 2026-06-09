import { createFileRoute } from "@tanstack/react-router";
import { Calendar } from "lucide-react";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events — KHCWW" },
      { name: "description", content: "Upcoming and past KHCWW welfare events. RSVP and stay informed." },
      { property: "og:title", content: "KHCWW Events" },
      { property: "og:description", content: "Upcoming and past welfare events." },
      { property: "og:url", content: "/events" },
    ],
    links: [{ rel: "canonical", href: "/events" }],
  }),
  component: Events,
});

function Events() {
  return (
    <SiteLayout>
      <PageHero eyebrow="Events" title="Upcoming & past events" subtitle="AGMs, welfare drives, trainings and member gatherings." />
      <section className="container-x py-20">
        <div className="max-w-xl mx-auto rounded-3xl border border-dashed border-border bg-surface-2 p-10 text-center">
          <Calendar className="h-8 w-8 mx-auto text-accent" />
          <h2 className="mt-3 font-display text-xl">Events calendar coming soon</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Once events are published from the admin, members will be able to RSVP and view event
            details, locations and materials here.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
