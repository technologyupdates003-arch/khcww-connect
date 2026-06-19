import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  LayoutDashboard, Newspaper, Image as ImageIcon, Calendar,
  Download, Mail, Megaphone, Users, LogOut, Globe, UserSquare2, Users2, Settings,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/use-auth";
import { Button } from "@/components/ui/button";
const logo = { url: "/khcww-logo.png" };
import { toast } from "sonner";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean };
const NAV: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/posts", label: "Blog posts", icon: Newspaper },
  { to: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { to: "/admin/events", label: "Events", icon: Calendar },
  { to: "/admin/downloads", label: "Downloads", icon: Download },
  { to: "/admin/banners", label: "Hero banners", icon: Megaphone },
  { to: "/admin/leaders", label: "Leadership", icon: UserSquare2 },
  { to: "/admin/teams", label: "Welfare teams", icon: Users2 },
  { to: "/admin/messages", label: "Messages", icon: Mail },
  { to: "/admin/subscribers", label: "Subscribers", icon: Users },
  { to: "/admin/settings", label: "Contact settings", icon: Settings },
];

export function AdminLayout({ title, children }: { title: string; children: ReactNode }) {
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!loading && user && !isAdmin) {
      toast.error("Your account is not an admin.");
    }
  }, [loading, user, isAdmin]);

  useEffect(() => {
    if (!isAdmin) return;
    let cancelled = false;
    const fetchUnread = async () => {
      const { count } = await supabase
        .from("contact_messages")
        .select("id", { count: "exact", head: true })
        .eq("read", false);
      if (!cancelled) setUnread(count ?? 0);
    };
    void fetchUnread();
    const channel = supabase
      .channel("admin-messages")
      .on("postgres_changes", { event: "*", schema: "public", table: "contact_messages" }, fetchUnread)
      .subscribe();
    return () => { cancelled = true; supabase.removeChannel(channel); };
  }, [isAdmin, path]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  if (loading) {
    return <div className="min-h-dvh grid place-items-center text-sm text-muted-foreground">Loading…</div>;
  }
  if (!isAdmin) {
    return (
      <div className="min-h-dvh grid place-items-center p-6">
        <div className="max-w-md text-center rounded-3xl border border-border bg-card p-8">
          <h1 className="font-display text-2xl">Not authorized</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This account exists but does not have admin access.
          </p>
          <div className="mt-5 flex gap-2 justify-center">
            <Button asChild variant="outline"><Link to="/">Go to website</Link></Button>
            <Button onClick={signOut}>Sign out</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh grid lg:grid-cols-[260px_1fr] bg-surface-2">
      <aside className="border-r border-border bg-card lg:sticky lg:top-0 lg:h-dvh flex flex-col">
        <div className="p-5 border-b border-border flex items-center gap-3">
          <img src={logo.url} alt="" className="h-10 w-10 rounded-full" />
          <div>
            <div className="font-display font-semibold leading-none">KHCWW</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">Admin</div>
          </div>
        </div>
        <nav className="p-3 grid gap-1">
          {NAV.map((n) => {
            const active = n.exact ? path === n.to : path.startsWith(n.to);
            const showBadge = n.to === "/admin/messages" && unread > 0;
            return (
              <Link
                key={n.to}
                to={n.to as any}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  active ? "brand-gradient text-white" : "hover:bg-secondary text-foreground/80"
                }`}
              >
                <n.icon className="h-4 w-4" />
                <span className="flex-1">{n.label}</span>
                {showBadge && (
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${active ? "bg-white/25 text-white" : "bg-accent text-accent-foreground"}`}>
                    {unread}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto p-3 border-t border-border grid gap-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-foreground rounded-md"
          >
            <Globe className="h-3.5 w-3.5" /> View website
          </a>
          <div className="px-3 text-[11px] text-muted-foreground truncate" title={user?.email ?? ""}>
            {user?.email}
          </div>
          <Button variant="outline" size="sm" onClick={signOut} className="justify-start">
            <LogOut className="h-4 w-4 mr-2" /> Sign out
          </Button>
        </div>
      </aside>

      <main className="min-w-0">
        <header className="border-b border-border bg-card/60 backdrop-blur sticky top-0 z-10">
          <div className="px-6 py-4 flex items-center justify-between">
            <h1 className="font-display text-xl">{title}</h1>
          </div>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
