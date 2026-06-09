import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/blog/$slug")({
  ssr: false,
  component: Post,
});

interface Post {
  id: string; slug: string; title: string; excerpt: string | null;
  content: string; category: string; cover_url: string | null;
  author: string | null; published_at: string | null; created_at: string;
}

function Post() {
  const { slug } = Route.useParams();
  const [post, setPost] = useState<Post | null | undefined>(undefined);

  useEffect(() => {
    supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle()
      .then(({ data }) => setPost((data as Post) ?? null));
  }, [slug]);

  if (post === undefined) {
    return <SiteLayout><div className="container-x py-32 text-center"><Loader2 className="h-6 w-6 mx-auto animate-spin text-muted-foreground" /></div></SiteLayout>;
  }
  if (post === null) {
    return (
      <SiteLayout>
        <div className="container-x py-32 text-center">
          <h1 className="font-display text-3xl">Article not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">It may have been removed or unpublished.</p>
          <Link to="/blog" className="inline-flex items-center gap-2 mt-6 text-sm text-accent">
            <ArrowLeft className="h-4 w-4" /> Back to news
          </Link>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <article className="container-x max-w-3xl py-14">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent">
          <ArrowLeft className="h-4 w-4" /> Back to news
        </Link>
        <div className="mt-6 text-xs uppercase tracking-widest text-accent">{post.category}</div>
        <h1 className="mt-2 font-display text-4xl md:text-5xl font-semibold">{post.title}</h1>
        <div className="mt-3 text-sm text-muted-foreground">
          {post.author && <>By {post.author} · </>}
          {new Date(post.published_at ?? post.created_at).toLocaleDateString()}
        </div>
        {post.cover_url && (
          <img src={post.cover_url} alt="" className="mt-8 rounded-2xl w-full aspect-[16/9] object-cover" />
        )}
        {post.excerpt && <p className="mt-6 text-lg text-muted-foreground">{post.excerpt}</p>}
        <div className="mt-6 whitespace-pre-wrap leading-relaxed text-foreground/90">{post.content}</div>
      </article>
    </SiteLayout>
  );
}
