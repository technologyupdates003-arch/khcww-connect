import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Calendar, Loader2, MapPin, Clock } from "lucide-react";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/events")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Events — KHCWW" },
      { name: "description", content: "Upcoming and past KHCWW welfare events." },
      { property: "og:title", content: "KHCWW Events" },
      { property: "og:description", content: "Upcoming and past welfare events." },
      { property: "og:url", content: "/events" },
    ],
    links: [{ rel: "canonical", href: "/events" }],
  }),
  component: Events,
});

interface Ev { id: string; title: string; description: string | null; location: string | null;
  starts_at: string; ends_at: string | null; cover_url: string | null; }

function Events() {
  const [events, setEvents] = useState<Ev[] | null>(null);

  useEffect(() => {
    supabase
      .from("events")
      .select("id, title, description, location, starts_at, ends_at, cover_url")
      .eq("published", true)
      .order("starts_at", { ascending: true })
      .then(({ data }) => setEvents((data as Ev[]) ?? []));
  }, []);

  const now = Date.now();
  const upcoming = events?.filter(e => new Date(e.starts_at).getTime() >= now) ?? [];
  const past = events?.filter(e => new Date(e.starts_at).getTime() < now).reverse() ?? [];

  return (
    <SiteLayout>
      <PageHero eyebrow="Events" title="Upcoming & past events" subtitle="AGMs, welfare drives, trainings and gatherings." />
      <section className="container-x py-14">
        {events === null ? (
          <div className="text-center py-20"><Loader2 className="h-6 w-6 mx-auto animate-spin text-muted-foreground" /></div>
        ) : events.length === 0 ? (
          <div className="max-w-xl mx-auto rounded-3xl border border-dashed border-border bg-surface-2 p-10 text-center">
            <Calendar className="h-8 w-8 mx-auto text-accent" />
            <h2 className="mt-3 font-display text-xl">No events scheduled</h2>
          </div>
        ) : (
          <div className="grid gap-10">
            <EventGroup label="Upcoming" items={upcoming} />
            <EventGroup label="Past" items={past} dim />
          </div>
        )}
      </section>
    </SiteLayout>
  );
}

function EventGroup({ label, items, dim }: { label: string; items: Ev[]; dim?: boolean }) {
  if (items.length === 0) return null;
  return (
    <div>
      <h2 className="font-display text-2xl mb-5">{label}</h2>
      <div className="grid md:grid-cols-2 gap-5">
        {items.map(e => (
          <article key={e.id} className={`rounded-2xl border border-border bg-card overflow-hidden ${dim ? "opacity-80" : ""}`}>
            {e.cover_url && <img src={e.cover_url} alt="" className="aspect-[16/9] w-full object-cover" />}
            <div className="p-5">
              <h3 className="font-display text-xl">{e.title}</h3>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {new Date(e.starts_at).toLocaleString()}</div>
                {e.location && <div className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {e.location}</div>}
              </div>
              {e.description && <p className="mt-3 text-sm">{e.description}</p>}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
