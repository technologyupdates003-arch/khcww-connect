import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Newspaper, Image as ImageIcon, Calendar, Download, Mail, Users, Megaphone, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminDashboard,
});

const CARDS = [
  { key: "blog_posts", label: "Blog posts", to: "/admin/posts", icon: Newspaper },
  { key: "gallery_items", label: "Gallery", to: "/admin/gallery", icon: ImageIcon },
  { key: "events", label: "Events", to: "/admin/events", icon: Calendar },
  { key: "downloads", label: "Downloads", to: "/admin/downloads", icon: Download },
  { key: "hero_banners", label: "Hero banners", to: "/admin/banners", icon: Megaphone },
  { key: "contact_messages", label: "Messages", to: "/admin/messages", icon: Mail },
  { key: "newsletter_subscribers", label: "Subscribers", to: "/admin/subscribers", icon: Users },
] as const;

function AdminDashboard() {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    (async () => {
      const result: Record<string, number> = {};
      await Promise.all(CARDS.map(async (c) => {
        const { count } = await (supabase as any).from(c.key).select("id", { count: "exact", head: true });
        result[c.key] = count ?? 0;
      }));
      setCounts(result);
    })();
  }, []);

  return (
    <AdminLayout title="Dashboard">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CARDS.map((c) => (
          <Link
            key={c.key}
            to={c.to as any}
            className="group rounded-2xl border border-border bg-card p-5 hover:shadow-soft transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="h-11 w-11 rounded-xl brand-gradient grid place-items-center text-white">
                <c.icon className="h-5 w-5" />
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="mt-4 text-3xl font-display">{counts[c.key] ?? "—"}</div>
            <div className="text-sm text-muted-foreground">{c.label}</div>
          </Link>
        ))}
      </div>
    </AdminLayout>
  );
}
