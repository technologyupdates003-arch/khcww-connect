import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, HeartHandshake, ShieldCheck, Users, Sparkles, Activity, Calendar } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
const logo = { url: "/khcww-logo.png" };
import { SITE, TEAMS, EXECUTIVE } from "@/lib/site-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KHCWW — Care · Support · Unity for Kirinyaga Health Workers" },
      {
        name: "description",
        content:
          "Kirinyaga Health Care Workers Welfare (KHCWW) unites health workers through welfare support, professional solidarity, and community service.",
      },
      { property: "og:title", content: "KHCWW — Care · Support · Unity" },
      { property: "og:description", content: SITE.description },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="hero-radial relative overflow-hidden">
        <div className="container-x grid lg:grid-cols-2 gap-10 items-center py-20 md:py-28">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/15 px-3 py-1 text-xs font-medium text-accent-foreground/90">
              <Sparkles className="h-3.5 w-3.5" /> {SITE.tagline}
            </div>
            <h1 className="mt-5 text-4xl md:text-6xl font-semibold leading-[1.05]">
              United for the{" "}
              <span className="brand-gradient-text">welfare</span> of every health worker.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              KHCWW brings together nurses, clinicians, lab scientists and support staff across
              Kirinyaga County — providing emergency support, professional solidarity, and a
              voice that matters.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg" className="brand-gradient text-white border-0 hover:opacity-90 shadow-glow">
                <Link to="/membership">
                  Become a Member <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/about">Our Story</Link>
              </Button>
            </div>

            <dl className="mt-10 grid grid-cols-3 gap-6 max-w-md">
              {[
                ["500+", "Members"],
                ["15+", "Institutions"],
                ["6", "Active Teams"],
              ].map(([n, l]) => (
                <div key={l}>
                  <dt className="font-display text-3xl text-foreground">{n}</dt>
                  <dd className="text-xs uppercase tracking-widest text-muted-foreground">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div className="absolute -inset-10 brand-gradient opacity-20 blur-3xl rounded-full" aria-hidden />
            <div className="relative glass rounded-3xl p-8 md:p-10 shadow-soft">
              <img src={logo.url} alt={SITE.name} className="mx-auto h-64 md:h-80 w-auto drop-shadow-2xl" />
              <div className="mt-4 text-center">
                <div className="font-display text-lg">{SITE.short}</div>
                <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  {SITE.tagline}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PILLARS */}
      <section className="container-x py-20">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { Icon: HeartHandshake, title: "Welfare First", body: "Emergency response, bereavement, and medical support when members need it most." },
            { Icon: ShieldCheck, title: "Solidarity", body: "A unified voice for health workers in Kirinyaga County." },
            { Icon: Users, title: "Community", body: "Mentorship, professional growth and lifelong networks." },
          ].map(({ Icon, title, body }) => (
            <div key={title} className="rounded-2xl border border-border bg-card p-6 hover:shadow-soft transition-shadow">
              <div className="h-11 w-11 rounded-xl brand-gradient grid place-items-center text-white">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TEAMS PREVIEW */}
      <section className="bg-surface-2 border-y border-border">
        <div className="container-x py-20">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <div className="text-xs uppercase tracking-[0.22em] text-accent-foreground/80">Our welfare teams</div>
              <h2 className="mt-2 text-3xl md:text-4xl font-semibold">Six teams, one mission</h2>
            </div>
            <Link to="/teams" className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1">
              All teams <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TEAMS.map((t) => (
              <Link
                key={t.slug}
                to="/teams/$slug"
                params={{ slug: t.slug }}
                className="group rounded-2xl border border-border bg-card p-6 hover:border-accent/60 hover:shadow-soft transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg brand-gradient grid place-items-center text-white">
                    <Activity className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-lg">{t.name}</h3>
                </div>
                <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{t.short}</p>
                <div className="mt-4 text-xs font-medium text-primary inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Learn more <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* LEADERSHIP PREVIEW */}
      <section className="container-x py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs uppercase tracking-[0.22em] text-accent-foreground/80">Executive committee</div>
          <h2 className="mt-2 text-3xl md:text-4xl font-semibold">Led by health workers, for health workers</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {EXECUTIVE.map((l) => (
            <div key={l.role} className="rounded-2xl border border-border bg-card p-6 text-center">
              <div className="mx-auto h-20 w-20 rounded-full brand-gradient grid place-items-center text-white font-display text-xl shadow-glow">
                {l.initials}
              </div>
              <div className="mt-4 font-display text-lg">{l.name}</div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">{l.role}</div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Button asChild variant="outline">
            <Link to="/leadership">Meet full leadership</Link>
          </Button>
        </div>
      </section>

      {/* CTA */}
      <section className="container-x pb-24">
        <div className="relative overflow-hidden rounded-3xl brand-gradient p-10 md:p-16 text-white shadow-glow">
          <div className="relative max-w-2xl">
            <Calendar className="h-8 w-8 opacity-90" />
            <h2 className="mt-4 text-3xl md:text-4xl font-semibold">
              Ready to stand with your colleagues?
            </h2>
            <p className="mt-3 text-white/85">
              Join hundreds of health care workers across Kirinyaga County. Registration takes
              minutes and the welfare fee is processed securely via M-Pesa.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="secondary" className="bg-white text-foreground hover:bg-white/90">
                <Link to="/membership">Register Now</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10">
                <Link to="/contact">Talk to us</Link>
              </Button>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 h-56 w-56 rounded-full bg-white/10 blur-2xl" aria-hidden />
        </div>
      </section>
    </SiteLayout>
  );
}
