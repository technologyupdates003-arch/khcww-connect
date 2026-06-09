import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { CrudPage } from "@/components/admin/CrudPage";

export const Route = createFileRoute("/_authenticated/admin/banners")({
  component: () => (
    <AdminLayout title="Hero banners">
      <CrudPage
        table="hero_banners"
        title="banner"
        orderBy={{ column: "sort_order", ascending: true }}
        columns={[
          { key: "title", label: "Title", render: (r: any) => <span className="font-medium">{r.title}</span> },
          { key: "cta_label", label: "Button" },
          { key: "active", label: "Active", render: (r: any) => r.active ? "Yes" : "No" },
          { key: "sort_order", label: "Order" },
        ]}
        fields={[
          { name: "title", label: "Headline", type: "text", required: true },
          { name: "subtitle", label: "Subtitle", type: "textarea" },
          { name: "image_url", label: "Background image URL", type: "url" },
          { name: "cta_label", label: "Button label", type: "text", placeholder: "e.g. Join KHCWW" },
          { name: "cta_url", label: "Button URL", type: "text", placeholder: "e.g. /membership" },
          { name: "active", label: "Active", type: "boolean", defaultValue: true },
          { name: "sort_order", label: "Sort order", type: "number", defaultValue: 0 },
        ]}
      />
    </AdminLayout>
  ),
});
