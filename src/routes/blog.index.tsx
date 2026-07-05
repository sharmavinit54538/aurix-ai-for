import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Section, SectionHeader } from "@/components/site/Section";
import { posts, categories } from "@/lib/blog-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog — Aurix" },
      { name: "description", content: "Stories, product updates, and ideas from the Aurix team." },
      { property: "og:title", content: "Blog — Aurix" },
      { property: "og:description", content: "Stories and ideas from the team building Aurix." },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const matchesCat = cat === "All" || p.category === cat;
      const matchesQ = !query || (p.title + p.excerpt).toLowerCase().includes(query.toLowerCase());
      return matchesCat && matchesQ;
    });
  }, [query, cat]);

  const featured = posts[0];

  return (
    <SiteLayout>
      <Section>
        <SectionHeader eyebrow="Blog" title="Ideas, stories, and product updates" subtitle="Writing from the team building Aurix." />

        {/* Featured */}
        <Link
          to="/blog/$slug"
          params={{ slug: featured.slug }}
          className="mt-16 grid md:grid-cols-2 gap-6 glass rounded-3xl overflow-hidden group hover:shadow-elegant transition-all"
        >
          <div className="aspect-[16/10] md:aspect-auto" style={{ background: featured.cover }} />
          <div className="p-8 flex flex-col justify-center">
            <div className="text-xs uppercase tracking-widest text-brand font-medium">Featured · {featured.category}</div>
            <h3 className="font-display text-2xl sm:text-3xl font-bold mt-3 group-hover:text-gradient transition-colors">{featured.title}</h3>
            <p className="text-muted-foreground mt-3">{featured.excerpt}</p>
            <div className="mt-6 text-sm text-muted-foreground">{featured.author} · {featured.date} · {featured.readTime}</div>
          </div>
        </Link>

        {/* Filters */}
        <div className="mt-16 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles"
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm transition-colors",
                  cat === c ? "bg-foreground text-background" : "glass hover:bg-secondary"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <Link
              key={p.slug}
              to="/blog/$slug"
              params={{ slug: p.slug }}
              className="group glass rounded-2xl overflow-hidden hover:shadow-elegant transition-all flex flex-col"
            >
              <div className="aspect-[16/10]" style={{ background: p.cover }} />
              <div className="p-6 flex-1 flex flex-col">
                <div className="text-xs uppercase tracking-widest text-brand font-medium">{p.category}</div>
                <h3 className="font-display text-xl font-bold mt-2 group-hover:text-gradient transition-colors">{p.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 flex-1">{p.excerpt}</p>
                <div className="mt-5 text-xs text-muted-foreground flex items-center justify-between">
                  <span>{p.date} · {p.readTime}</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">No articles match your search.</div>
        )}
      </Section>
    </SiteLayout>
  );
}
