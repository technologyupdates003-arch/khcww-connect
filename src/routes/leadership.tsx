import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { EXECUTIVE, WELFARE_COMMITTEE, type Leader } from "@/lib/site-data";

export const Route = createFileRoute("/leadership")({
  head: () => ({
    meta: [
      { title: "Leadership — KHCWW" },
      { name: "description", content: "Meet the Executive Committee and Welfare Committee of KHCWW." },
      { property: "og:title", content: "KHCWW Leadership" },
      { property: "og:description", content: "Executive and Welfare Committee leading KHCWW." },
      { property: "og:url", content: "/leadership" },
    ],
    links: [{ rel: "canonical", href: "/leadership" }],
  }),
  component: Leadership,
});

function Leadership() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Leadership"
        title="The people leading KHCWW"
        subtitle="Elected by members, accountable to members."
      />
      <Group title="Executive Committee" people={EXECUTIVE} />
      <Group title="Welfare Committee" people={WELFARE_COMMITTEE} />
    </SiteLayout>
  );
}

function Group({ title, people }: { title: string; people: Leader[] }) {
  return (
    <section className="container-x py-14">
      <h2 className="text-2xl md:text-3xl font-semibold mb-8">{title}</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {people.map((p) => (
          <article key={p.role} className="rounded-2xl border border-border bg-card p-6">
            <div className="mx-auto h-24 w-24 rounded-full brand-gradient grid place-items-center text-white font-display text-2xl shadow-glow">
              {p.initials}
            </div>
            <div className="mt-4 text-center">
              <div className="font-display text-lg">{p.name}</div>
              <div className="text-xs uppercase tracking-widest text-accent-foreground/80 mt-1">
                {p.role}
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{p.bio}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
