import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { CrudPage } from "@/components/admin/CrudPage";

export const Route = createFileRoute("/_authenticated/admin/downloads")({
  component: () => (
    <AdminLayout title="Downloads">
      <CrudPage
        table="downloads"
        title="download"
        orderBy={{ column: "sort_order", ascending: true }}
        columns={[
          { key: "title", label: "Title", render: (r: any) => <span className="font-medium">{r.title}</span> },
          { key: "category", label: "Category" },
          { key: "file_size_kb", label: "Size", render: (r: any) => r.file_size_kb ? `${r.file_size_kb} KB` : "—" },
          { key: "file_url", label: "File", render: (r: any) => (
            <a href={r.file_url} target="_blank" rel="noreferrer" className="text-accent underline text-xs">Open</a>
          ) },
        ]}
        fields={[
          { name: "title", label: "Title", type: "text", required: true },
          { name: "description", label: "Description", type: "textarea" },
          { name: "file_url", label: "File URL (PDF, DOC, etc.)", type: "url", required: true },
          { name: "file_size_kb", label: "File size (KB)", type: "number" },
          { name: "category", label: "Category", type: "text", defaultValue: "Document" },
          { name: "sort_order", label: "Sort order", type: "number", defaultValue: 0 },
        ]}
      />
    </AdminLayout>
  ),
});
