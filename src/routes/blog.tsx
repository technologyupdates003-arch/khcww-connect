import { createFileRoute } from "@tanstack/react-router";
import { Newspaper } from "lucide-react";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "News & Updates — KHCWW" },
      { name: "description", content: "Welfare news, announcements, healthcare updates and member stories from KHCWW." },
      { property: "og:title", content: "KHCWW News & Updates" },
      { property: "og:description", content: "Welfare news, announcements and member stories." },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: Blog,
});

function Blog() {
  return (
    <SiteLayout>
      <PageHero eyebrow="News" title="News & Updates" subtitle="Welfare announcements, healthcare updates, and member stories." />
      <section className="container-x py-20">
        <Placeholder
          title="Articles will appear here soon"
          body="The admin panel for managing blog posts is being prepared. Categories will include Welfare News, Announcements, Healthcare Updates and Member Stories."
        />
      </section>
    </SiteLayout>
  );
}

export function Placeholder({ title, body }: { title: string; body: string }) {
  return (
    <div className="max-w-xl mx-auto rounded-3xl border border-dashed border-border bg-surface-2 p-10 text-center">
      <Newspaper className="h-8 w-8 mx-auto text-accent" />
      <h2 className="mt-3 font-display text-xl">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
