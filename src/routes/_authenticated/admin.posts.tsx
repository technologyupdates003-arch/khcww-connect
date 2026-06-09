import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { CrudPage } from "@/components/admin/CrudPage";

export const Route = createFileRoute("/_authenticated/admin/posts")({
  component: () => (
    <AdminLayout title="Blog posts">
      <CrudPage
        table="blog_posts"
        title="post"
        orderBy={{ column: "created_at", ascending: false }}
        columns={[
          { key: "title", label: "Title", render: (r: any) => <span className="font-medium">{r.title}</span> },
          { key: "category", label: "Category" },
          { key: "published", label: "Status", render: (r: any) => (
            <span className={`text-xs px-2 py-0.5 rounded-full ${r.published ? "bg-green-500/15 text-green-700 dark:text-green-400" : "bg-muted text-muted-foreground"}`}>
              {r.published ? "Published" : "Draft"}
            </span>
          ) },
          { key: "created_at", label: "Created", render: (r: any) => new Date(r.created_at).toLocaleDateString() },
        ]}
        fields={[
          { name: "title", label: "Title", type: "text", required: true },
          { name: "slug", label: "Slug", type: "text", required: true, help: "URL-safe identifier, e.g. 'annual-welfare-report'" },
          { name: "category", label: "Category", type: "text", defaultValue: "News", help: "e.g. News, Announcements, Healthcare Updates, Member Stories" },
          { name: "author", label: "Author", type: "text" },
          { name: "cover_url", label: "Cover image URL", type: "url" },
          { name: "excerpt", label: "Excerpt", type: "textarea" },
          { name: "content", label: "Content (Markdown or plain text)", type: "textarea", required: true },
          { name: "published", label: "Published", type: "boolean", defaultValue: false },
          { name: "published_at", label: "Publish date", type: "datetime" },
        ]}
      />
    </AdminLayout>
  ),
});
