import { createFileRoute } from "@tanstack/react-router";
import { Target, Eye, BookOpen, History, CheckCircle2 } from "lucide-react";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { OBJECTIVES, SITE } from "@/lib/site-data";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About KHCWW — Vision, Mission & History" },
      { name: "description", content: `Learn about ${SITE.name}: our vision, mission, objectives and history.` },
      { property: "og:title", content: "About KHCWW" },
      { property: "og:description", content: `Vision, mission and history of ${SITE.name}.` },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

function About() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="About us"
        title="Care, support, and unity for every health worker"
        subtitle={SITE.description}
      />

      <section className="container-x py-16 grid md:grid-cols-2 gap-6">
        <Card icon={<Eye className="h-5 w-5" />} title="Our Vision">
          A united, well-supported and professionally empowered health workforce serving every
          community in Kirinyaga County with excellence.
        </Card>
        <Card icon={<Target className="h-5 w-5" />} title="Our Mission">
          To champion the welfare, professional growth and collective voice of health care
          workers through structured support, advocacy and solidarity.
        </Card>
      </section>

      <section className="container-x py-8">
        <div className="rounded-3xl border border-border bg-card p-8 md:p-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg brand-gradient grid place-items-center text-white">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold">Our Objectives</h2>
          </div>
          <ul className="grid md:grid-cols-2 gap-4">
            {OBJECTIVES.map((o, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="mt-1 h-5 w-5 shrink-0 rounded-full brand-gradient grid place-items-center text-white text-[10px] font-bold">
                  {i + 1}
                </span>
                <span className="text-foreground/85">{o}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-x py-16 grid md:grid-cols-2 gap-6">
        <Card icon={<BookOpen className="h-5 w-5" />} title="Constitution">
          Our constitution governs membership, leadership elections, contributions and welfare
          disbursement. A copy is available in the Downloads section.
        </Card>
        <Card icon={<History className="h-5 w-5" />} title="History">
          Founded by a coalition of health workers from across Kirinyaga County, KHCWW emerged
          from a shared need for organized welfare and professional solidarity. Since inception,
          the association has supported hundreds of members through bereavement, medical
          emergencies and professional milestones.
        </Card>
      </section>
    </SiteLayout>
  );
}

function Card({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-7 hover:shadow-soft transition-shadow">
      <div className="h-11 w-11 rounded-xl brand-gradient grid place-items-center text-white">
        {icon}
      </div>
      <h3 className="mt-4 text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{children}</p>
    </div>
  );
}
