import { createFileRoute } from "@tanstack/react-router";
import { Target, Eye, Heart, Users, Sparkles, TrendingUp } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Section, SectionHeader } from "@/components/site/Section";
import { CTA } from "@/components/site/CTA";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Aurix" },
      { name: "description", content: "Aurix is on a mission to give every team the operating system they deserve." },
      { property: "og:title", content: "About — Aurix" },
      { property: "og:description", content: "Our mission, our story, and the team building Aurix." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

const values = [
  { icon: Sparkles, title: "Craft", desc: "We sweat the millimeter. Polish is a feature." },
  { icon: Users, title: "Customer-obsessed", desc: "Every roadmap decision starts with a real conversation." },
  { icon: TrendingUp, title: "Bias to ship", desc: "We move fast, learn faster, and trust our taste." },
  { icon: Heart, title: "Respect", desc: "Kindness scales. We build a place people want to stay." },
];

const team = [
  { name: "Priya Patel", role: "CEO & Co-founder", bio: "Previously product at Stripe and Linear." },
  { name: "Elena Rivera", role: "Head of Product", bio: "Built the Notion mobile experience from scratch." },
  { name: "James Okoye", role: "VP Engineering", bio: "Distributed systems lead at Cloudflare." },
  { name: "Marcus Chen", role: "Principal Designer", bio: "Design systems at Airbnb and Figma." },
  { name: "Sara Lindqvist", role: "Director of AI", bio: "Applied research at DeepMind." },
  { name: "Daniel Kim", role: "Head of Growth", bio: "Scaled three SaaS companies past 100M ARR." },
];

const timeline = [
  { year: "2022", title: "The first sketch", desc: "Two co-founders, one Figma file, a shared frustration with bloated tools." },
  { year: "2023", title: "Private beta", desc: "300 teams. 4 months of relentless iteration." },
  { year: "2024", title: "Public launch", desc: "10,000 teams in the first quarter. The product began to define a category." },
  { year: "2025", title: "Aurix AI", desc: "Native AI woven through every surface — not bolted on top." },
  { year: "2026", title: "Today", desc: "12,000+ teams in 180 countries shipping with Aurix." },
];

function AboutPage() {
  return (
    <SiteLayout>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-glow" />
        <Section className="relative text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-medium mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-gradient-brand" />
            About Aurix
          </div>
          <h1 className="font-display text-5xl sm:text-6xl font-bold tracking-tight max-w-3xl mx-auto leading-tight">
            We're building the operating system <span className="text-gradient">teams deserve</span>.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Software for work is stuck in 2012. Aurix is a fresh take — engineered for the way modern teams actually move, with the polish of a product you'd pay double for.
          </p>
        </Section>
      </section>

      {/* Mission & Vision */}
      <Section>
        <div className="grid md:grid-cols-2 gap-5">
          {[
            { icon: Target, title: "Mission", text: "Give every team — regardless of size — the calm, focused workspace usually reserved for the most elite engineering orgs." },
            { icon: Eye, title: "Vision", text: "A world where great software is the default, and where teams spend their time on the work, not the tooling around the work." },
          ].map((b) => (
            <div key={b.title} className="glass rounded-3xl p-10">
              <div className="h-12 w-12 rounded-xl bg-gradient-brand grid place-items-center shadow-glow mb-6">
                <b.icon className="h-5 w-5 text-brand-foreground" />
              </div>
              <h3 className="font-display text-2xl font-bold mb-3">{b.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{b.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Story */}
      <Section>
        <SectionHeader eyebrow="Our story" title="Built by people who lived the problem" />
        <div className="mt-12 max-w-3xl mx-auto space-y-5 text-muted-foreground leading-relaxed text-lg">
          <p>Aurix started in a small studio in Lisbon in 2022. Our founders had built and shipped product at some of the most respected tech companies — and were tired of stitching together five tools to get anything done.</p>
          <p>The first version of Aurix was an opinionated weekend project. It got passed quietly between teams who told their friends. Within a year, thousands of companies were using it daily.</p>
          <p>Today, Aurix is a team of 60 across three continents, building one of the most loved products in its category. We're still early.</p>
        </div>
      </Section>

      {/* Team */}
      <Section>
        <SectionHeader eyebrow="Team" title="The people building Aurix" />
        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {team.map((t) => (
            <div key={t.name} className="glass rounded-2xl p-6">
              <div className="h-14 w-14 rounded-full bg-gradient-brand grid place-items-center text-brand-foreground font-display font-bold text-lg mb-4">
                {t.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <h3 className="font-semibold">{t.name}</h3>
              <div className="text-sm text-brand mb-2">{t.role}</div>
              <p className="text-sm text-muted-foreground">{t.bio}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Values */}
      <Section>
        <SectionHeader eyebrow="Values" title="What we believe" />
        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {values.map((v) => (
            <div key={v.title} className="glass rounded-2xl p-6">
              <div className="h-11 w-11 rounded-xl bg-gradient-brand grid place-items-center shadow-glow mb-4">
                <v.icon className="h-5 w-5 text-brand-foreground" />
              </div>
              <h3 className="font-semibold mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground">{v.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Timeline */}
      <Section>
        <SectionHeader eyebrow="Milestones" title="Our journey so far" />
        <div className="mt-16 max-w-3xl mx-auto relative">
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-brand/40 to-transparent" />
          {timeline.map((t, i) => (
            <div key={t.year} className={`relative pl-12 sm:pl-0 sm:grid sm:grid-cols-2 sm:gap-12 mb-10 ${i % 2 === 0 ? "" : "sm:[&>div:first-child]:order-2"}`}>
              <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-gradient-brand shadow-glow" />
              <div className={i % 2 === 0 ? "sm:text-right sm:pr-8" : "sm:pl-8"}>
                <div className="text-sm text-brand font-medium">{t.year}</div>
                <h3 className="font-display text-xl font-bold mt-1">{t.title}</h3>
                <p className="text-muted-foreground mt-1">{t.desc}</p>
              </div>
              <div />
            </div>
          ))}
        </div>
      </Section>

      <CTA title="Come build with us" subtitle="We're hiring across product, engineering, and design." />
    </SiteLayout>
  );
}
