import { createFileRoute } from "@tanstack/react-router";
import { Target, Eye, Heart, Users, Sparkles, TrendingUp } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Section, SectionHeader } from "@/components/site/Section";
import { CTA } from "@/components/site/CTA";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — OFC360" },
      { name: "description", content: "OFC360 is on a mission to give every team the operating system they deserve." },
      { property: "og:title", content: "About — OFC360" },
      { property: "og:description", content: "Our mission, our story, and the team building OFC360." },
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

const timeline = [
  { year: "2022", title: "The first sketch", desc: "A unified platform architecture designed to reduce operational complexity." },
  { year: "2023", title: "Initial release", desc: "Core modules deployed with continuous feedback and architectural refinement." },
  { year: "2024", title: "Enterprise expansion", desc: "Comprehensive workforce, payroll, and role-based permissions expansion." },
  { year: "2025", title: "OFC360", desc: "AI-assisted workforce management integrated across platform surfaces." },
  { year: "2026", title: "Today", desc: "A modern, reliable operating system for growing organizations." },
];

function AboutPage() {
  return (
    <SiteLayout>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-glow" />
        <Section className="relative text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-medium mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-gradient-brand" />
            About OFC360
          </div>
          <h1 className="font-display text-5xl sm:text-6xl font-bold tracking-tight max-w-3xl mx-auto leading-tight">
            We're building the operating system <span className="text-gradient">teams deserve</span>.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            OFC360 is engineered for modern organizations — unifying workforce workflows, payroll, compliance, and operations in a single, focused platform.
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
        <SectionHeader eyebrow="Our story" title="Built to solve operational complexity" />
        <div className="mt-12 max-w-3xl mx-auto space-y-5 text-muted-foreground leading-relaxed text-lg">
          <p>OFC360 was founded to eliminate the friction modern organizations face when managing distributed operations, payroll, compliance, and employee workflows.</p>
          <p>Instead of stitching together disconnected tools and disparate spreadsheets, OFC360 provides a single, coherent source of truth for your business.</p>
          <p>Our focus is delivering robust software that respects your team's time and gives administrators the clear oversight they need.</p>
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
