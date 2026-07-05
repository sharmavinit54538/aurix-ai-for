import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Section, SectionHeader } from "@/components/site/Section";
import { CTA } from "@/components/site/CTA";
import { FAQ } from "@/components/site/FAQ";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Aurix" },
      { name: "description", content: "Simple, transparent pricing. Free for small teams. Scales with you." },
      { property: "og:title", content: "Pricing — Aurix" },
      { property: "og:description", content: "Simple, transparent pricing for every team size." },
      { property: "og:url", content: "/pricing" },
    ],
    links: [{ rel: "canonical", href: "/pricing" }],
  }),
  component: PricingPage,
});

type Plan = {
  name: string;
  tagline: string;
  monthly: number | null;
  yearly: number | null;
  cta: string;
  highlight?: boolean;
  features: string[];
};

const plans: Plan[] = [
  {
    name: "Free",
    tagline: "For individuals exploring Aurix.",
    monthly: 0,
    yearly: 0,
    cta: "Start free",
    features: ["Up to 10 members", "Unlimited projects", "7-day activity history", "Community support"],
  },
  {
    name: "Pro",
    tagline: "For growing teams that need more.",
    monthly: 12,
    yearly: 10,
    cta: "Start free trial",
    highlight: true,
    features: ["Unlimited members", "Unlimited history", "Aurix AI included", "Advanced integrations", "Priority support"],
  },
  {
    name: "Business",
    tagline: "For organizations that ship at scale.",
    monthly: 28,
    yearly: 24,
    cta: "Start free trial",
    features: ["Everything in Pro", "SSO & SCIM", "Audit logs", "Custom roles", "99.99% uptime SLA"],
  },
  {
    name: "Enterprise",
    tagline: "For the largest, most security-conscious teams.",
    monthly: null,
    yearly: null,
    cta: "Contact sales",
    features: ["Custom contracts", "Dedicated CSM", "Custom security review", "Volume pricing", "24/7 premium support"],
  },
];

const comparison = [
  { feature: "Members", values: ["10", "Unlimited", "Unlimited", "Unlimited"] },
  { feature: "Projects", values: ["Unlimited", "Unlimited", "Unlimited", "Unlimited"] },
  { feature: "Aurix AI", values: ["—", "Included", "Included", "Custom"] },
  { feature: "Integrations", values: ["Basic", "Advanced", "Advanced", "Custom"] },
  { feature: "SSO / SCIM", values: ["—", "—", "Yes", "Yes"] },
  { feature: "Audit logs", values: ["—", "—", "Yes", "Yes"] },
  { feature: "Uptime SLA", values: ["—", "99.9%", "99.99%", "Custom"] },
  { feature: "Support", values: ["Community", "Priority", "Priority", "24/7 Premium"] },
];

const faqs = [
  { q: "Can I change plans later?", a: "Yes. Upgrade, downgrade, or cancel at any time — changes are pro-rated automatically." },
  { q: "Do you offer discounts for nonprofits or education?", a: "We offer 50% off Pro and Business for verified nonprofits and educational institutions." },
  { q: "Is there a free trial of Pro?", a: "Yes. Pro and Business come with a 14-day free trial — no credit card required." },
  { q: "How does billing work?", a: "You'll be billed monthly or annually based on your selection. Annual plans save you ~16%." },
];

function PricingPage() {
  const [yearly, setYearly] = useState(true);

  return (
    <SiteLayout>
      <Section>
        <SectionHeader
          eyebrow="Pricing"
          title="Simple pricing that scales with your team"
          subtitle="Start free. Upgrade when you need to. Cancel anytime."
        />

        <div className="mt-10 flex justify-center">
          <div className="glass rounded-full p-1 inline-flex text-sm">
            <button
              onClick={() => setYearly(false)}
              className={cn("px-5 py-2 rounded-full transition-colors", !yearly && "bg-foreground text-background")}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={cn("px-5 py-2 rounded-full transition-colors inline-flex items-center gap-2", yearly && "bg-foreground text-background")}
            >
              Yearly <span className="text-xs px-2 py-0.5 rounded-full bg-gradient-brand text-brand-foreground">-16%</span>
            </button>
          </div>
        </div>

        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {plans.map((p) => {
            const price = yearly ? p.yearly : p.monthly;
            return (
              <div
                key={p.name}
                className={cn(
                  "relative rounded-3xl p-7 flex flex-col",
                  p.highlight ? "bg-gradient-brand text-brand-foreground shadow-glow" : "glass"
                )}
              >
                {p.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-background text-foreground text-xs font-medium border border-border">
                    Most popular
                  </div>
                )}
                <h3 className="font-display text-xl font-bold">{p.name}</h3>
                <p className={cn("text-sm mt-1", p.highlight ? "opacity-80" : "text-muted-foreground")}>{p.tagline}</p>
                <div className="mt-6 mb-2">
                  {price === null ? (
                    <div className="font-display text-4xl font-bold">Custom</div>
                  ) : (
                    <>
                      <span className="font-display text-5xl font-bold">${price}</span>
                      <span className={cn("ml-1 text-sm", p.highlight ? "opacity-80" : "text-muted-foreground")}>/user/mo</span>
                    </>
                  )}
                </div>
                <a
                  href="#"
                  className={cn(
                    "mt-4 inline-flex items-center justify-center px-4 py-2.5 rounded-xl font-medium transition-opacity",
                    p.highlight ? "bg-background text-foreground hover:opacity-90" : "bg-foreground text-background hover:opacity-90"
                  )}
                >
                  {p.cta}
                </a>
                <ul className="mt-7 space-y-3 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2.5">
                      <Check className={cn("h-4 w-4 mt-0.5 shrink-0", p.highlight ? "" : "text-brand")} />
                      <span className={p.highlight ? "" : "text-muted-foreground"}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Comparison */}
      <Section>
        <SectionHeader eyebrow="Comparison" title="Compare every plan" />
        <div className="mt-12 glass rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-5 font-medium">Feature</th>
                  {plans.map((p) => (
                    <th key={p.name} className="text-left p-5 font-medium">{p.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, i) => (
                  <tr key={row.feature} className={i % 2 ? "bg-secondary/30" : ""}>
                    <td className="p-5 font-medium">{row.feature}</td>
                    {row.values.map((v, j) => (
                      <td key={j} className="p-5 text-muted-foreground">{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      <FAQ items={faqs} title="Pricing questions" subtitle="Common questions about our plans." />
      <CTA />
    </SiteLayout>
  );
}
