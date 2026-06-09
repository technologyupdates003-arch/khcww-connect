import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Loader2, Users } from "lucide-react";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/teams")({
  head: () => ({
    meta: [
      { title: "Welfare Teams — KHCWW" },
      { name: "description", content: "The welfare teams powering KHCWW's day-to-day work." },
      { property: "og:title", content: "KHCWW Welfare Teams" },
      { property: "og:description", content: "Welfare, Finance, Membership, Events, Communications and Youth teams." },
      { property: "og:url", content: "/teams" },
    ],
    links: [{ rel: "canonical", href: "/teams" }],
  }),
  component: TeamsIndex,
});

interface TeamRow {
  id: string;
  slug: string;
  name: string;
  short: string | null;
  image_url: string | null;
}

function TeamsIndex() {
  const [rows, setRows] = useState<TeamRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await (supabase as any)
        .from("teams")
        .select("id,slug,name,short,image_url")
        .eq("published", true)
        .order("sort_order", { ascending: true });
      setRows((data as TeamRow[]) ?? []);
      setLoading(false);
    })();
  }, []);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Welfare teams"
        title="Teams, one mission"
        subtitle="Each team is led by elected members and supported by volunteers from across the county."
      />
      <section className="container-x py-14">
        {loading ? (
          <div className="text-center text-muted-foreground"><Loader2 className="h-6 w-6 mx-auto animate-spin" /></div>
        ) : rows.length === 0 ? (
          <div className="text-center text-muted-foreground">No teams published yet.</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {rows.map((t) => (
              <Link
                key={t.id}
                to="/teams/$slug"
                params={{ slug: t.slug }}
                className="group rounded-2xl border border-border bg-card p-6 hover:border-accent/60 hover:shadow-soft transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg brand-gradient grid place-items-center text-white">
                    <Users className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-lg">{t.name}</h3>
                </div>
                {t.short && <p className="mt-3 text-sm text-muted-foreground">{t.short}</p>}
                <div className="mt-4 text-xs font-medium text-primary inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  View team <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
