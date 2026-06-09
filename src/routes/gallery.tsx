import { createFileRoute } from "@tanstack/react-router";
import { ImageIcon } from "lucide-react";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — KHCWW" },
      { name: "description", content: "Photos and videos from KHCWW meetings, welfare activities, trainings and community outreach." },
      { property: "og:title", content: "KHCWW Gallery" },
      { property: "og:description", content: "Photos from KHCWW events and activities." },
      { property: "og:url", content: "/gallery" },
    ],
    links: [{ rel: "canonical", href: "/gallery" }],
  }),
  component: Gallery,
});

function Gallery() {
  return (
    <SiteLayout>
      <PageHero eyebrow="Gallery" title="Moments from our community" subtitle="Meetings, welfare activities, trainings, outreach, awards and conferences." />
      <section className="container-x py-20">
        <div className="max-w-xl mx-auto rounded-3xl border border-dashed border-border bg-surface-2 p-10 text-center">
          <ImageIcon className="h-8 w-8 mx-auto text-accent" />
          <h2 className="mt-3 font-display text-xl">Gallery coming soon</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Photo and video albums will be published once the admin uploads media. The gallery
            will support a masonry layout with lightbox and album filtering.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
