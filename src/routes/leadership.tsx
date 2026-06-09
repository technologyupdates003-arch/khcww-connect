import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

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

interface Leader {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  initials: string | null;
  photo_url: string | null;
  group_type: "executive" | "welfare_committee";
}

function Leadership() {
  const [rows, setRows] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await (supabase as any)
        .from("leaders")
        .select("id,name,role,bio,initials,photo_url,group_type")
        .eq("published", true)
        .order("sort_order", { ascending: true });
      setRows((data as Leader[]) ?? []);
      setLoading(false);
    })();
  }, []);

  const executive = rows.filter((r) => r.group_type === "executive");
  const welfare = rows.filter((r) => r.group_type === "welfare_committee");

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Leadership"
        title="The people leading KHCWW"
        subtitle="Elected by members, accountable to members."
      />
      {loading ? (
        <div className="container-x py-16 text-center text-muted-foreground">
          <Loader2 className="h-6 w-6 mx-auto animate-spin" />
        </div>
      ) : (
        <>
          <Group title="Executive Committee" people={executive} />
          <Group title="Welfare Committee" people={welfare} />
        </>
      )}
    </SiteLayout>
  );
}

function Group({ title, people }: { title: string; people: Leader[] }) {
  if (people.length === 0) return null;
  return (
    <section className="container-x py-14">
      <h2 className="text-2xl md:text-3xl font-semibold mb-8">{title}</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {people.map((p) => (
          <article key={p.id} className="rounded-2xl border border-border bg-card p-6">
            {p.photo_url ? (
              <img src={p.photo_url} alt={p.name} className="mx-auto h-24 w-24 rounded-full object-cover shadow-glow" />
            ) : (
              <div className="mx-auto h-24 w-24 rounded-full brand-gradient grid place-items-center text-white font-display text-2xl shadow-glow">
                {p.initials ?? p.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="mt-4 text-center">
              <div className="font-display text-lg">{p.name}</div>
              <div className="text-xs uppercase tracking-widest text-accent-foreground/80 mt-1">
                {p.role}
              </div>
              {p.bio && <p className="mt-3 text-sm text-muted-foreground">{p.bio}</p>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
