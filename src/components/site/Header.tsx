import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
const logo = { url: "/khcww-logo.png" };
import { SITE } from "@/lib/site-data";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/leadership", label: "Leadership" },
  { to: "/teams", label: "Teams" },
  { to: "/blog", label: "News" },
  { to: "/gallery", label: "Gallery" },
  { to: "/events", label: "Events" },
  { to: "/downloads", label: "Downloads" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all ${
        scrolled ? "glass shadow-soft" : "bg-transparent"
      }`}
    >
      <div className="container-x flex items-center justify-between gap-4 py-3">
        <Link to="/" className="flex items-center gap-3 group" aria-label={SITE.name}>
          <img
            src={logo.url}
            alt=""
            className="h-11 w-11 rounded-full ring-1 ring-accent/40 transition-transform group-hover:scale-105"
          />
          <div className="leading-tight hidden sm:block">
            <div className="font-display text-base font-semibold">{SITE.short}</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              {SITE.tagline}
            </div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground rounded-md hover:bg-secondary transition-colors"
              activeProps={{ className: "text-foreground bg-secondary" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild className="hidden sm:inline-flex brand-gradient text-white border-0 hover:opacity-90 shadow-glow">
            <Link to="/membership">Join KHCWW</Link>
          </Button>
          <button
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-md border border-border"
            aria-label="Toggle navigation"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border glass">
          <nav className="container-x py-3 grid grid-cols-2 gap-1">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 text-sm font-medium rounded-md hover:bg-secondary"
                activeProps={{ className: "bg-secondary" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
            <Link
              to="/membership"
              onClick={() => setOpen(false)}
              className="col-span-2 mt-2 px-3 py-2.5 text-center text-sm font-semibold brand-gradient text-white rounded-md"
            >
              Join KHCWW
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
