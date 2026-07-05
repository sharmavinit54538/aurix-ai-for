import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Section, SectionHeader } from "@/components/site/Section";
import { CTA } from "@/components/site/CTA";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Aurix" },
      { name: "description", content: "Answers to common questions about Aurix — product, pricing, security, and more." },
      { property: "og:title", content: "FAQ — Aurix" },
      { property: "og:description", content: "Everything you need to know about Aurix." },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
  }),
  component: FAQPage,
});

const groups = [
  {
    name: "Product",
    items: [
      { q: "What is Aurix?", a: "Aurix is a unified workspace for product teams — combining planning, execution, and analytics in one fast interface." },
      { q: "What platforms does it run on?", a: "We have native macOS, Windows, iOS, and Android apps, plus a web app that runs anywhere." },
      { q: "Can I use it offline?", a: "Yes — Aurix is local-first. Your data is available offline and syncs when you're back online." },
    ],
  },
  {
    name: "Pricing & billing",
    items: [
      { q: "Is there a free plan?", a: "Yes. Our Free plan supports up to 10 members and is generous enough for most early-stage teams." },
      { q: "Can I change plans later?", a: "Anytime — upgrades and downgrades are pro-rated automatically." },
      { q: "Do you offer discounts?", a: "Yes, 50% off for verified nonprofits and educational institutions." },
    ],
  },
  {
    name: "Security",
    items: [
      { q: "Is Aurix SOC 2 certified?", a: "We are SOC 2 Type II certified and undergo annual audits." },
      { q: "Do you support SSO?", a: "Yes — SAML SSO and SCIM provisioning are available on Business and Enterprise plans." },
      { q: "Where is my data stored?", a: "You can choose between US, EU, or APAC regions. Data is encrypted in transit and at rest." },
    ],
  },
  {
    name: "Integrations",
    items: [
      { q: "Does Aurix integrate with GitHub?", a: "Yes — bi-directional sync with GitHub, GitLab, Bitbucket, and others." },
      { q: "Can I bring my data from another tool?", a: "We support one-click migration from Jira, Linear, Asana, and Notion." },
      { q: "Do you have a public API?", a: "Yes — fully documented REST and GraphQL APIs, plus webhooks for every event." },
    ],
  },
];

function FAQPage() {
  const [q, setQ] = useState("");
  const [tab, setTab] = useState(groups[0].name);

  const visible = useMemo(() => {
    if (!q) return groups;
    return groups
      .map((g) => ({
        ...g,
        items: g.items.filter((i) => (i.q + i.a).toLowerCase().includes(q.toLowerCase())),
      }))
      .filter((g) => g.items.length);
  }, [q]);

  return (
    <SiteLayout>
      <Section>
        <SectionHeader eyebrow="Help center" title="Frequently asked questions" subtitle="Quick answers to the questions our team hears most." />

        <div className="mt-10 max-w-2xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search questions"
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {!q && (
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {groups.map((g) => (
              <button
                key={g.name}
                onClick={() => {
                  setTab(g.name);
                  document.getElementById(`g-${g.name}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className={cn(
                  "px-4 py-2 rounded-full text-sm transition-colors",
                  tab === g.name ? "bg-foreground text-background" : "glass hover:bg-secondary"
                )}
              >
                {g.name}
              </button>
            ))}
          </div>
        )}

        <div className="mt-12 max-w-3xl mx-auto space-y-12">
          {visible.map((g) => (
            <div key={g.name} id={`g-${g.name}`}>
              <h3 className="font-display text-xl font-bold mb-4">{g.name}</h3>
              <Accordion type="single" collapsible className="space-y-3">
                {g.items.map((it, i) => (
                  <AccordionItem key={i} value={`${g.name}-${i}`} className="glass rounded-2xl px-5 border-none">
                    <AccordionTrigger className="text-left font-medium hover:no-underline py-5">{it.q}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed pb-5">{it.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
          {visible.length === 0 && (
            <p className="text-center text-muted-foreground">No questions match your search.</p>
          )}
        </div>
      </Section>

      <CTA title="Still have questions?" subtitle="Our team is happy to help — usually within a few hours." />
    </SiteLayout>
  );
}
