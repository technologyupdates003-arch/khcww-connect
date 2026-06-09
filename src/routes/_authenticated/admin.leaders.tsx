import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { CrudPage } from "@/components/admin/CrudPage";

export const Route = createFileRoute("/_authenticated/admin/leaders")({
  component: () => (
    <AdminLayout title="Leadership">
      <CrudPage
        table="leaders"
        title="leader"
        orderBy={{ column: "sort_order", ascending: true }}
        columns={[
          { key: "name", label: "Name", render: (r: any) => <span className="font-medium">{r.name}</span> },
          { key: "role", label: "Role" },
          { key: "group_type", label: "Group", render: (r: any) => r.group_type === "executive" ? "Executive" : "Welfare Committee" },
          { key: "sort_order", label: "Order" },
          { key: "published", label: "Status", render: (r: any) => (
            <span className={`text-xs px-2 py-0.5 rounded-full ${r.published ? "bg-green-500/15 text-green-700 dark:text-green-400" : "bg-muted text-muted-foreground"}`}>
              {r.published ? "Visible" : "Hidden"}
            </span>
          ) },
        ]}
        fields={[
          { name: "name", label: "Full name", type: "text", required: true },
          { name: "role", label: "Role / title", type: "text", required: true },
          { name: "group_type", label: "Group", type: "select", required: true, defaultValue: "executive",
            options: [
              { value: "executive", label: "Executive Committee" },
              { value: "welfare_committee", label: "Welfare Committee" },
            ] },
          { name: "initials", label: "Initials (avatar fallback)", type: "text", help: "2-letter shortcode, e.g. CP" },
          { name: "photo_url", label: "Photo", type: "image" },
          { name: "bio", label: "Short bio", type: "textarea" },
          { name: "sort_order", label: "Sort order", type: "number", defaultValue: 0 },
          { name: "published", label: "Visible on website", type: "boolean", defaultValue: true },
        ]}
      />
    </AdminLayout>
  ),
});
