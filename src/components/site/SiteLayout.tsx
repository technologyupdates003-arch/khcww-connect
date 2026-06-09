import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="hero-radial border-b border-border">
      <div className="container-x py-16 md:py-24 text-center">
        {eyebrow && (
          <div className="inline-block text-xs uppercase tracking-[0.22em] text-accent-foreground/80 bg-accent/30 px-3 py-1 rounded-full mb-4">
            {eyebrow}
          </div>
        )}
        <h1 className="text-4xl md:text-5xl font-semibold">{title}</h1>
        {subtitle && (
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
