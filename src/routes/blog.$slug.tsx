import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Section } from "@/components/site/Section";
import { CTA } from "@/components/site/CTA";
import { posts } from "@/lib/blog-data";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = posts.find((p) => p.slug === params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.post.title} — Aurix Blog` },
          { name: "description", content: loaderData.post.excerpt },
          { property: "og:title", content: loaderData.post.title },
          { property: "og:description", content: loaderData.post.excerpt },
          { property: "og:type", content: "article" },
          { property: "og:url", content: `/blog/${loaderData.post.slug}` },
        ]
      : [],
    links: loaderData ? [{ rel: "canonical", href: `/blog/${loaderData.post.slug}` }] : [],
  }),
  notFoundComponent: () => (
    <SiteLayout>
      <Section className="text-center">
        <h1 className="font-display text-3xl font-bold">Article not found</h1>
        <Link to="/blog" className="mt-6 inline-block text-brand">Back to blog</Link>
      </Section>
    </SiteLayout>
  ),
  component: BlogPost,
});

function BlogPost() {
  const { post } = Route.useLoaderData();
  const related = posts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <SiteLayout>
      <Section className="max-w-3xl">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to blog
        </Link>
        <div className="mt-8 text-xs uppercase tracking-widest text-brand font-medium">{post.category}</div>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl font-bold tracking-tight leading-tight">{post.title}</h1>
        <div className="mt-6 flex items-center gap-3 text-sm text-muted-foreground">
          <div className="h-9 w-9 rounded-full bg-gradient-brand grid place-items-center text-brand-foreground font-medium text-xs">
            {post.author.split(" ").map((n: string) => n[0]).join("")}

          </div>
          <div>
            <div className="text-foreground font-medium">{post.author}</div>
            <div>{post.authorRole} · {post.date} · {post.readTime}</div>
          </div>
        </div>
      </Section>

      <Section className="max-w-5xl py-0">
        <div className="aspect-[16/8] rounded-3xl shadow-elegant" style={{ background: post.cover }} />
      </Section>

      <Section className="max-w-3xl">
        <article className="prose prose-lg max-w-none space-y-6 text-lg leading-relaxed text-muted-foreground">
          {post.content.map((p: string, i: number) => (
            <p key={i}>{p}</p>
          ))}
        </article>

        {/* Author */}
        <div className="mt-16 glass rounded-2xl p-6 flex items-start gap-4">
          <div className="h-14 w-14 rounded-full bg-gradient-brand grid place-items-center text-brand-foreground font-display font-bold">
            {post.author.split(" ").map((n: string) => n[0]).join("")}
          </div>
          <div>
            <div className="font-semibold">{post.author}</div>
            <div className="text-sm text-brand">{post.authorRole}</div>
            <p className="mt-2 text-sm text-muted-foreground">Writing about product, craft, and the future of work at Aurix.</p>
          </div>
        </div>

        {/* Comments */}
        <div className="mt-12">
          <h3 className="font-display text-xl font-bold flex items-center gap-2 mb-6">
            <MessageSquare className="h-5 w-5" /> Comments (3)
          </h3>
          <div className="space-y-4">
            {[
              { author: "Tomás Costa", time: "2 days ago", text: "This resonated. The bit about tight loops vs handoffs is exactly what we're working through." },
              { author: "Alex Romero", time: "4 days ago", text: "Would love to see a follow-up with concrete numbers from a few of the teams." },
              { author: "Yuki Tanaka", time: "1 week ago", text: "Sharing this with my team — thanks for writing it up so clearly." },
            ].map((c, i) => (
              <div key={i} className="glass rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-brand grid place-items-center text-brand-foreground text-xs font-medium">
                    {c.author.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{c.author}</div>
                    <div className="text-xs text-muted-foreground">{c.time}</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{c.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 glass rounded-2xl p-5">
            <textarea
              rows={3}
              placeholder="Leave a comment…"
              className="w-full bg-transparent text-sm focus:outline-none resize-none"
            />
            <div className="mt-3 flex justify-end">
              <button className="px-4 py-2 rounded-lg bg-gradient-brand text-brand-foreground text-sm font-medium">Post comment</button>
            </div>
          </div>
        </div>
      </Section>

      {/* Related */}
      <Section>
        <h3 className="font-display text-2xl font-bold mb-8">Related posts</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {related.map((p) => (
            <Link key={p.slug} to="/blog/$slug" params={{ slug: p.slug }} className="group glass rounded-2xl overflow-hidden hover:shadow-elegant transition-all">
              <div className="aspect-[16/10]" style={{ background: p.cover }} />
              <div className="p-5">
                <div className="text-xs uppercase tracking-widest text-brand font-medium">{p.category}</div>
                <div className="font-display text-lg font-bold mt-2 group-hover:text-gradient transition-colors">{p.title}</div>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      <CTA />
    </SiteLayout>
  );
}
