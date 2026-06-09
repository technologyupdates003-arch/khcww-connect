import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";

const CATEGORIES = [
  { title: "Constitution", body: "Governing document of KHCWW." },
  { title: "Membership Guide", body: "How to join and what to expect." },
  { title: "Welfare Policies", body: "Disbursement rules and eligibility." },
  { title: "Annual Reports", body: "Yearly impact and financial summaries." },
  { title: "Event Materials", body: "Slides and notes from past events." },
];

export const Route = createFileRoute("/downloads")({
  head: () => ({
    meta: [
      { title: "Downloads — KHCWW" },
      { name: "description", content: "Constitution, membership guide, welfare policies and annual reports." },
      { property: "og:title", content: "KHCWW Downloads" },
      { property: "og:description", content: "Documents you can download." },
      { property: "og:url", content: "/downloads" },
    ],
    links: [{ rel: "canonical", href: "/downloads" }],
  }),
  component: Downloads,
});

function Downloads() {
  return (
    <SiteLayout>
      <PageHero eyebrow="Downloads" title="Documents & resources" subtitle="Official KHCWW documents available for download." />
      <section className="container-x py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATEGORIES.map((c) => (
            <div key={c.title} className="rounded-2xl border border-border bg-card p-6">
              <div className="h-11 w-11 rounded-xl brand-gradient grid place-items-center text-white">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg">{c.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{c.body}</p>
              <div className="mt-4 text-xs text-muted-foreground italic">
                Files will appear once uploaded from the admin.
              </div>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
