import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Newspaper, Loader2 } from "lucide-react";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/blog")({
  ssr: false,
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

interface Post {
  id: string; slug: string; title: string; excerpt: string | null;
  category: string; cover_url: string | null; published_at: string | null; created_at: string;
}

function Blog() {
  const [posts, setPosts] = useState<Post[] | null>(null);

  useEffect(() => {
    supabase
      .from("blog_posts")
      .select("id, slug, title, excerpt, category, cover_url, published_at, created_at")
      .eq("published", true)
      .order("published_at", { ascending: false, nullsFirst: false })
      .then(({ data }) => setPosts((data as Post[]) ?? []));
  }, []);

  return (
    <SiteLayout>
      <PageHero eyebrow="News" title="News & Updates" subtitle="Welfare announcements, healthcare updates and member stories." />
      <section className="container-x py-14">
        {posts === null ? (
          <div className="text-center py-20"><Loader2 className="h-6 w-6 mx-auto animate-spin text-muted-foreground" /></div>
        ) : posts.length === 0 ? (
          <div className="max-w-xl mx-auto rounded-3xl border border-dashed border-border bg-surface-2 p-10 text-center">
            <Newspaper className="h-8 w-8 mx-auto text-accent" />
            <h2 className="mt-3 font-display text-xl">No articles yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">Check back soon — new articles will appear here.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((p) => (
              <Link
                key={p.id}
                to={"/blog/" + p.slug as any}
                className="rounded-2xl border border-border bg-card overflow-hidden hover:shadow-soft transition-all group"
              >
                {p.cover_url ? (
                  <img src={p.cover_url} alt="" className="aspect-[16/10] w-full object-cover" />
                ) : (
                  <div className="aspect-[16/10] brand-gradient opacity-90" />
                )}
                <div className="p-5">
                  <div className="text-xs uppercase tracking-widest text-accent">{p.category}</div>
                  <h3 className="mt-2 font-display text-lg group-hover:text-accent transition-colors">{p.title}</h3>
                  {p.excerpt && <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{p.excerpt}</p>}
                  <div className="mt-3 text-xs text-muted-foreground">
                    {new Date(p.published_at ?? p.created_at).toLocaleDateString()}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
