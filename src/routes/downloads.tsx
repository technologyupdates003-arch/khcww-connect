import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FileText, Loader2, Download as DownloadIcon } from "lucide-react";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/downloads")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Downloads — KHCWW" },
      { name: "description", content: "Constitution, membership guide, welfare policies and annual reports." },
      { property: "og:title", content: "KHCWW Downloads" },
      { property: "og:description", content: "Documents you can download." },
      { property: "og:url", content: "/downloads" },
    ],
    links: [{ rel: "canonical", href: "/downloads" }],
  }),
  component: Downloads,
});

interface D { id: string; title: string; description: string | null; file_url: string;
  file_size_kb: number | null; category: string; }

function Downloads() {
  const [items, setItems] = useState<D[] | null>(null);

  useEffect(() => {
    supabase
      .from("downloads")
      .select("id, title, description, file_url, file_size_kb, category")
      .order("sort_order", { ascending: true })
      .then(({ data }) => setItems((data as D[]) ?? []));
  }, []);

  const grouped: Record<string, D[]> = {};
  for (const d of items ?? []) (grouped[d.category] ||= []).push(d);

  return (
    <SiteLayout>
      <PageHero eyebrow="Downloads" title="Documents & resources" subtitle="Official KHCWW documents available for download." />
      <section className="container-x py-14">
        {items === null ? (
          <div className="text-center py-20"><Loader2 className="h-6 w-6 mx-auto animate-spin text-muted-foreground" /></div>
        ) : items.length === 0 ? (
          <div className="max-w-xl mx-auto rounded-3xl border border-dashed border-border bg-surface-2 p-10 text-center">
            <FileText className="h-8 w-8 mx-auto text-accent" />
            <h2 className="mt-3 font-display text-xl">No documents yet</h2>
          </div>
        ) : (
          <div className="grid gap-10">
            {Object.entries(grouped).map(([cat, docs]) => (
              <div key={cat}>
                <h2 className="font-display text-2xl mb-4">{cat}</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {docs.map(d => (
                    <a key={d.id} href={d.file_url} target="_blank" rel="noreferrer" className="rounded-2xl border border-border bg-card p-6 hover:shadow-soft transition-all group">
                      <div className="h-11 w-11 rounded-xl brand-gradient grid place-items-center text-white">
                        <FileText className="h-5 w-5" />
                      </div>
                      <h3 className="mt-4 font-display text-lg">{d.title}</h3>
                      {d.description && <p className="mt-1 text-sm text-muted-foreground">{d.description}</p>}
                      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                        <span>{d.file_size_kb ? `${d.file_size_kb} KB` : "Download"}</span>
                        <DownloadIcon className="h-4 w-4 text-accent group-hover:translate-y-0.5 transition-transform" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
