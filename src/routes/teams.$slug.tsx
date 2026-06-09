import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, ImageIcon, User } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { TEAMS } from "@/lib/site-data";

export const Route = createFileRoute("/teams/$slug")({
  loader: ({ params }) => {
    const team = TEAMS.find((t) => t.slug === params.slug);
    if (!team) throw notFound();
    return { team };
  },
  head: ({ loaderData }) => {
    const team = loaderData?.team;
    const title = team ? `${team.name} — KHCWW` : "Team — KHCWW";
    const desc = team?.short ?? "KHCWW welfare team";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: `/teams/${team?.slug ?? ""}` },
      ],
      links: team ? [{ rel: "canonical", href: `/teams/${team.slug}` }] : [],
    };
  },
  component: TeamPage,
  notFoundComponent: () => (
    <SiteLayout>
      <div className="container-x py-24 text-center">
        <h1 className="font-display text-3xl">Team not found</h1>
        <Link to="/teams" className="mt-4 inline-block text-primary hover:underline">
          ← Back to teams
        </Link>
      </div>
    </SiteLayout>
  ),
  errorComponent: ({ error }) => (
    <SiteLayout>
      <div className="container-x py-24 text-center text-destructive">{error.message}</div>
    </SiteLayout>
  ),
});

function TeamPage() {
  const { team } = Route.useLoaderData();
  return (
    <SiteLayout>
      <section className="hero-radial border-b border-border">
        <div className="container-x py-14 md:py-20">
          <Link
            to="/teams"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> All teams
          </Link>
          <div className="text-xs uppercase tracking-[0.22em] text-accent-foreground/80">Welfare team</div>
          <h1 className="mt-2 text-4xl md:text-5xl font-semibold">{team.name}</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground text-lg">{team.short}</p>
        </div>
      </section>

      <section className="container-x py-14 grid lg:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Team leader</div>
          <div className="mt-3 flex items-center gap-3">
            <div className="h-12 w-12 rounded-full brand-gradient grid place-items-center text-white">
              <User className="h-5 w-5" />
            </div>
            <div>
              <div className="font-display text-lg">{team.leader}</div>
              <div className="text-xs text-muted-foreground">Team Lead</div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 lg:col-span-2">
          <h2 className="font-semibold mb-3">Team members</h2>
          <ul className="grid sm:grid-cols-2 gap-2 text-sm">
            {team.members.map((m) => (
              <li key={m} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full brand-gradient" /> {m}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-x pb-14">
        <div className="rounded-2xl border border-border bg-card p-7">
          <h2 className="text-xl font-semibold mb-4">Activities</h2>
          <ul className="space-y-3">
            {team.activities.map((a) => (
              <li key={a} className="flex gap-3 text-sm">
                <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-x pb-20">
        <div className="rounded-2xl border border-dashed border-border bg-surface-2 p-10 text-center">
          <ImageIcon className="h-7 w-7 mx-auto text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">
            Team gallery will appear here once photos are uploaded from the admin.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
