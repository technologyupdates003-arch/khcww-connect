import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { CrudPage } from "@/components/admin/CrudPage";

export const Route = createFileRoute("/_authenticated/admin/teams")({
  component: () => (
    <AdminLayout title="Welfare teams">
      <CrudPage
        table="teams"
        title="team"
        orderBy={{ column: "sort_order", ascending: true }}
        columns={[
          { key: "name", label: "Name", render: (r: any) => <span className="font-medium">{r.name}</span> },
          { key: "slug", label: "Slug", render: (r: any) => <code className="text-xs">{r.slug}</code> },
          { key: "leader_name", label: "Lead" },
          { key: "members", label: "Members", render: (r: any) => (r.members?.length ?? 0) },
          { key: "published", label: "Status", render: (r: any) => (
            <span className={`text-xs px-2 py-0.5 rounded-full ${r.published ? "bg-green-500/15 text-green-700 dark:text-green-400" : "bg-muted text-muted-foreground"}`}>
              {r.published ? "Visible" : "Hidden"}
            </span>
          ) },
        ]}
        fields={[
          { name: "name", label: "Team name", type: "text", required: true },
          { name: "slug", label: "Slug", type: "text", required: true, help: "URL identifier, e.g. 'welfare', 'finance'. Lowercase, no spaces." },
          { name: "short", label: "Short description", type: "textarea" },
          { name: "image_url", label: "Team image", type: "image" },
          { name: "leader_name", label: "Team leader name", type: "text" },
          { name: "members", label: "Members (one per line)", type: "list" },
          { name: "activities", label: "Activities (one per line)", type: "list" },
          { name: "sort_order", label: "Sort order", type: "number", defaultValue: 0 },
          { name: "published", label: "Visible on website", type: "boolean", defaultValue: true },
        ]}
      />
    </AdminLayout>
  ),
});
