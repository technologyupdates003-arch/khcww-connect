import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { CrudPage } from "@/components/admin/CrudPage";

export const Route = createFileRoute("/_authenticated/admin/events")({
  component: () => (
    <AdminLayout title="Events">
      <CrudPage
        table="events"
        title="event"
        orderBy={{ column: "starts_at", ascending: true }}
        columns={[
          { key: "title", label: "Title", render: (r: any) => <span className="font-medium">{r.title}</span> },
          { key: "starts_at", label: "When", render: (r: any) => new Date(r.starts_at).toLocaleString() },
          { key: "location", label: "Location" },
          { key: "published", label: "Status", render: (r: any) => (
            <span className={`text-xs px-2 py-0.5 rounded-full ${r.published ? "bg-green-500/15 text-green-700 dark:text-green-400" : "bg-muted text-muted-foreground"}`}>
              {r.published ? "Live" : "Hidden"}
            </span>
          ) },
        ]}
        fields={[
          { name: "title", label: "Title", type: "text", required: true },
          { name: "description", label: "Description", type: "textarea" },
          { name: "location", label: "Location", type: "text" },
          { name: "starts_at", label: "Starts at", type: "datetime", required: true },
          { name: "ends_at", label: "Ends at", type: "datetime" },
          { name: "cover_url", label: "Cover image URL", type: "url" },
          { name: "published", label: "Published", type: "boolean", defaultValue: true },
        ]}
      />
    </AdminLayout>
  ),
});
