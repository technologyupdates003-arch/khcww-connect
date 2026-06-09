import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

// TODO: replace with your project URL once a project name or custom domain is set.
const BASE_URL = "";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/about", changefreq: "monthly", priority: "0.8" },
          { path: "/leadership", changefreq: "monthly", priority: "0.7" },
          { path: "/teams", changefreq: "monthly", priority: "0.8" },
          { path: "/teams/welfare", changefreq: "monthly", priority: "0.6" },
          { path: "/teams/finance", changefreq: "monthly", priority: "0.6" },
          { path: "/teams/membership", changefreq: "monthly", priority: "0.6" },
          { path: "/teams/events", changefreq: "monthly", priority: "0.6" },
          { path: "/teams/communications", changefreq: "monthly", priority: "0.6" },
          { path: "/teams/youth-mentorship", changefreq: "monthly", priority: "0.6" },
          { path: "/membership", changefreq: "monthly", priority: "0.9" },
          { path: "/blog", changefreq: "weekly", priority: "0.7" },
          { path: "/gallery", changefreq: "monthly", priority: "0.5" },
          { path: "/events", changefreq: "weekly", priority: "0.7" },
          { path: "/downloads", changefreq: "monthly", priority: "0.5" },
          { path: "/contact", changefreq: "yearly", priority: "0.4" },
        ];

        const urls = entries
          .map((e) =>
            [
              `  <url>`,
              `    <loc>${BASE_URL}${e.path}</loc>`,
              e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
              e.priority ? `    <priority>${e.priority}</priority>` : null,
              `  </url>`,
            ]
              .filter(Boolean)
              .join("\n"),
          )
          .join("\n");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
