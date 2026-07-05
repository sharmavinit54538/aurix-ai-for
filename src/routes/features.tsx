import { createFileRoute } from "@tanstack/react-router";
import {
  Workflow, Zap, Shield, Layers, BarChart3, Sparkles,
  GitBranch, MessageSquare, Calendar, Search, Bell, Lock, Globe, Cpu
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Section, SectionHeader } from "@/components/site/Section";
import { CTA } from "@/components/site/CTA";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features — Aurix" },
      { name: "description", content: "Explore everything Aurix can do — planning, AI, analytics, integrations, and more." },
      { property: "og:title", content: "Features — Aurix" },
      { property: "og:description", content: "Every capability Aurix offers, in detail." },
      { property: "og:url", content: "/features" },
    ],
    links: [{ rel: "canonical", href: "/features" }],
  }),
  component: FeaturesPage,
});

const detailed = [
  { icon: Workflow, title: "Unified planning", desc: "Roadmaps, sprints, and quarterly goals — connected by default. No more reconciling four tools." },
  { icon: Sparkles, title: "Aurix AI", desc: "Drafts updates, summarizes threads, and triages issues. Trained on your team's context, not the internet." },
  { icon: BarChart3, title: "Insights", desc: "Velocity, cycle time, and team health — out of the box. No dashboards to build." },
  { icon: GitBranch, title: "Deep code integrations", desc: "Bi-directional sync with GitHub, GitLab, and Linear. Issues update from PR titles automatically." },
  { icon: MessageSquare, title: "Threaded discussions", desc: "Discuss in context. Decisions are linked to the work — not lost in Slack." },
  { icon: Calendar, title: "Smart scheduling", desc: "Aurix learns your team's rhythm and suggests realistic timelines." },
];

const capabilities = [
  { icon: Zap, title: "100ms everything", desc: "Local-first architecture. Optimistic UI. Keyboard shortcuts for every action." },
  { icon: Search, title: "Universal search", desc: "Find anything across projects, docs, comments, and files in milliseconds." },
  { icon: Bell, title: "Calm notifications", desc: "Smart batching. You decide what's worth interrupting you." },
  { icon: Layers, title: "Custom views", desc: "Slice your data by any field, save as a view, share with your team." },
  { icon: Lock, title: "Granular permissions", desc: "Project, document, and field-level access — without becoming an admin headache." },
  { icon: Cpu, title: "API & webhooks", desc: "Build on top of Aurix with a clean, fully documented REST and GraphQL API." },
];

const integrations = [
  "GitHub", "GitLab", "Slack", "Figma", "Linear", "Notion",
  "Jira", "Zoom", "Google Drive", "Loom", "Datadog", "Sentry",
];

function FeaturesPage() {
  return (
    <SiteLayout>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-glow" />
        <Section className="relative text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-medium mb-6">
            <Sparkles className="h-3 w-3" /> Features
          </div>
          <h1 className="font-display text-5xl sm:text-6xl font-bold tracking-tight max-w-3xl mx-auto leading-tight">
            One workspace. <span className="text-gradient">Infinite leverage</span>.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Aurix is engineered to make every step from idea to shipped feel effortless. Here's how.
          </p>
        </Section>
      </section>

      {/* Detailed features */}
      <Section>
        <SectionHeader eyebrow="Core" title="The work surface, redesigned" />
        <div className="mt-16 grid md:grid-cols-2 gap-5">
          {detailed.map((f, i) => (
            <div key={f.title} className="group glass rounded-3xl p-8 hover:shadow-elegant transition-all relative overflow-hidden">
              <div className="absolute -top-20 -right-20 h-40 w-40 bg-gradient-brand opacity-10 blur-3xl group-hover:opacity-30 transition-opacity" />
              <div className="h-12 w-12 rounded-xl bg-gradient-brand grid place-items-center shadow-glow mb-5">
                <f.icon className="h-5 w-5 text-brand-foreground" />
              </div>
              <h3 className="font-display text-xl font-bold mb-2">{f.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Capabilities */}
      <Section>
        <SectionHeader eyebrow="Capabilities" title="Power in every detail" subtitle="The small things that compound into a product your team won't want to leave." />
        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {capabilities.map((c) => (
            <div key={c.title} className="rounded-2xl p-6 border border-border">
              <c.icon className="h-5 w-5 text-brand mb-4" />
              <h3 className="font-semibold mb-2">{c.title}</h3>
              <p className="text-sm text-muted-foreground">{c.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Product screenshot */}
      <Section>
        <SectionHeader eyebrow="In action" title="See it work" />
        <div className="mt-12 relative">
          <div className="absolute -inset-4 bg-gradient-brand opacity-30 blur-3xl rounded-3xl" />
          <div className="relative glass rounded-3xl p-2 shadow-elegant">
            <div className="rounded-2xl bg-card border border-border overflow-hidden min-h-[480px]">
              <div className="grid grid-cols-12 h-full min-h-[480px]">
                <div className="col-span-3 border-r border-border p-4 hidden md:flex flex-col gap-1">
                  {["Inbox", "Today", "Projects", "Roadmap", "Docs", "Insights"].map((s, i) => (
                    <div key={s} className={`px-3 py-2 rounded-lg text-sm ${i === 2 ? "bg-secondary" : "text-muted-foreground"}`}>{s}</div>
                  ))}
                </div>
                <div className="col-span-12 md:col-span-9 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="text-xs text-muted-foreground">Projects</div>
                      <h3 className="font-display text-2xl font-bold">All work</h3>
                    </div>
                    <div className="h-8 w-32 rounded-lg bg-gradient-brand opacity-80" />
                  </div>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="rounded-xl border border-border p-4 hover:bg-secondary/40 transition-colors">
                        <div className={`h-1.5 w-12 rounded-full mb-3 ${i % 3 === 0 ? "bg-chart-2" : i % 3 === 1 ? "bg-brand" : "bg-chart-4"}`} />
                        <div className="text-sm font-medium">Project {i}</div>
                        <div className="text-xs text-muted-foreground mt-1">{12 + i * 3} tasks · {Math.floor(40 + i * 8)}%</div>
                        <div className="mt-3 h-1.5 rounded-full bg-secondary overflow-hidden">
                          <div className="h-full bg-gradient-brand" style={{ width: `${40 + i * 8}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Integrations */}
      <Section>
        <SectionHeader eyebrow="Integrations" title="Plays nicely with your stack" subtitle="Connect Aurix to the tools your team already uses." />
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {integrations.map((name) => (
            <div key={name} className="glass rounded-2xl p-5 text-center hover:shadow-elegant transition-all">
              <div className="h-10 w-10 rounded-lg bg-gradient-brand mx-auto mb-3 opacity-80 grid place-items-center">
                <Globe className="h-5 w-5 text-brand-foreground" />
              </div>
              <div className="text-sm font-medium">{name}</div>
            </div>
          ))}
        </div>
      </Section>

      <CTA />
    </SiteLayout>
  );
}
