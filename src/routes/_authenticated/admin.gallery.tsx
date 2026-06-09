import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { CrudPage } from "@/components/admin/CrudPage";

export const Route = createFileRoute("/_authenticated/admin/gallery")({
  component: () => (
    <AdminLayout title="Gallery">
      <CrudPage
        table="gallery_items"
        title="image"
        orderBy={{ column: "sort_order", ascending: true }}
        columns={[
          { key: "image_url", label: "Image", render: (r: any) => (
            <img src={r.image_url} alt="" className="h-12 w-16 object-cover rounded" />
          ) },
          { key: "title", label: "Title" },
          { key: "category", label: "Category" },
          { key: "sort_order", label: "Order" },
        ]}
        fields={[
          { name: "title", label: "Title", type: "text", required: true },
          { name: "caption", label: "Caption", type: "textarea" },
          { name: "image_url", label: "Image URL", type: "url", required: true, help: "Paste a public image URL" },
          { name: "category", label: "Category", type: "text", defaultValue: "General" },
          { name: "sort_order", label: "Sort order", type: "number", defaultValue: 0 },
        ]}
      />
    </AdminLayout>
  ),
});
