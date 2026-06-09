import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ImageIcon, Loader2, X } from "lucide-react";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/gallery")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Gallery — KHCWW" },
      { name: "description", content: "Photos from KHCWW meetings, welfare activities, trainings and community outreach." },
      { property: "og:title", content: "KHCWW Gallery" },
      { property: "og:description", content: "Photos from KHCWW events and activities." },
      { property: "og:url", content: "/gallery" },
    ],
    links: [{ rel: "canonical", href: "/gallery" }],
  }),
  component: Gallery,
});

interface Item { id: string; title: string; caption: string | null; image_url: string; category: string; }

function Gallery() {
  const [items, setItems] = useState<Item[] | null>(null);
  const [active, setActive] = useState<Item | null>(null);
  const [filter, setFilter] = useState<string>("All");

  useEffect(() => {
    supabase
      .from("gallery_items")
      .select("id, title, caption, image_url, category")
      .order("sort_order", { ascending: true })
      .then(({ data }) => setItems((data as Item[]) ?? []));
  }, []);

  const categories = items ? ["All", ...Array.from(new Set(items.map(i => i.category)))] : [];
  const filtered = items?.filter(i => filter === "All" || i.category === filter) ?? [];

  return (
    <SiteLayout>
      <PageHero eyebrow="Gallery" title="Moments from our community" subtitle="Meetings, welfare activities, trainings and outreach." />
      <section className="container-x py-14">
        {items === null ? (
          <div className="text-center py-20"><Loader2 className="h-6 w-6 mx-auto animate-spin text-muted-foreground" /></div>
        ) : items.length === 0 ? (
          <div className="max-w-xl mx-auto rounded-3xl border border-dashed border-border bg-surface-2 p-10 text-center">
            <ImageIcon className="h-8 w-8 mx-auto text-accent" />
            <h2 className="mt-3 font-display text-xl">No photos yet</h2>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {categories.map(c => (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={`px-4 py-1.5 rounded-full text-sm border ${filter === c ? "brand-gradient text-white border-transparent" : "border-border hover:bg-secondary"}`}
                >{c}</button>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filtered.map(i => (
                <button key={i.id} onClick={() => setActive(i)} className="group relative aspect-square overflow-hidden rounded-xl">
                  <img src={i.image_url} alt={i.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3 text-left">
                    <span className="text-white text-sm font-medium">{i.title}</span>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </section>

      {active && (
        <div onClick={() => setActive(null)} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm grid place-items-center p-4">
          <button className="absolute top-4 right-4 h-10 w-10 grid place-items-center rounded-full bg-white/10 text-white"><X className="h-5 w-5" /></button>
          <div onClick={e => e.stopPropagation()} className="max-w-5xl w-full">
            <img src={active.image_url} alt={active.title} className="w-full max-h-[80vh] object-contain rounded-lg" />
            <div className="text-center text-white mt-4">
              <div className="font-display text-lg">{active.title}</div>
              {active.caption && <div className="text-sm opacity-80 mt-1">{active.caption}</div>}
            </div>
          </div>
        </div>
      )}
    </SiteLayout>
  );
}
