import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import logo from "@/assets/khcww-logo.png.asset.json";
import { SITE } from "@/lib/site-data";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-surface-2">
      <div className="container-x py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2 max-w-md">
          <div className="flex items-center gap-3">
            <img src={logo.url} alt="" className="h-12 w-12 rounded-full" />
            <div>
              <div className="font-display font-semibold">{SITE.short}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest">
                {SITE.tagline}
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">{SITE.description}</p>
          <div className="mt-5 flex gap-3">
            {[
              { Icon: Facebook, href: SITE.socials.facebook, label: "Facebook" },
              { Icon: Twitter, href: SITE.socials.twitter, label: "Twitter" },
              { Icon: Instagram, href: SITE.socials.instagram, label: "Instagram" },
              { Icon: Youtube, href: SITE.socials.youtube, label: "YouTube" },
            ].map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="h-9 w-9 rounded-full border border-border grid place-items-center hover:bg-secondary transition-colors"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-3">Explore</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {[
              ["/about", "About Us"],
              ["/leadership", "Leadership"],
              ["/teams", "Welfare Teams"],
              ["/membership", "Join Us"],
              ["/blog", "News & Updates"],
              ["/events", "Events"],
              ["/downloads", "Downloads"],
            ].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="hover:text-foreground transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-3">Contact</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2"><MapPin className="h-4 w-4 mt-0.5 text-accent" /> {SITE.address}</li>
            <li className="flex gap-2"><Phone className="h-4 w-4 mt-0.5 text-accent" /> {SITE.phone}</li>
            <li className="flex gap-2"><Mail className="h-4 w-4 mt-0.5 text-accent" /> {SITE.email}</li>
          </ul>
          <div className="mt-4 rounded-lg border border-border p-3 text-xs">
            <div className="font-semibold text-foreground">Emergency line</div>
            <div className="text-muted-foreground">{SITE.emergency}</div>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-x py-5 flex flex-col sm:flex-row gap-2 items-center justify-between text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</div>
          <div>Care · Support · Unity</div>
        </div>
      </div>
    </footer>
  );
}
