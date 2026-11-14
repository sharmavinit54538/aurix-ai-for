import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Section, SectionHeader } from "@/components/site/Section";
import { Check } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({ meta: [{ title: "Pricing — OFC360" }] }),
  component: PricingPage,
});

const PLANS = [
  { name: "Growth", price: "$8", desc: "For scaling startups and agile HR teams.", features: ["Core HR & Directory", "Attendance & Leaves", "Employee Self-Service"] },
  { name: "Enterprise", price: "$16", desc: "Full-stack workforce, payroll, and AI intelligence.", features: ["Everything in Growth", "Enterprise Payroll & Statutory", "Recruitment ATS & AI Hub", "Executive Command Centers"] },
];

function PricingPage() {
  return (
    <SiteLayout>
      <Section>
        <SectionHeader eyebrow="Pricing" title="Simple, transparent plans" />
        <div className="mt-12 grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
          {PLANS.map((p) => (
            <div key={p.name} className="glass rounded-3xl p-8 flex flex-col justify-between">
              <div>
                <h3 className="font-display text-2xl font-bold">{p.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
                <div className="mt-6 text-4xl font-bold">{p.price}<span className="text-sm font-normal text-muted-foreground">/user/mo</span></div>
                <ul className="mt-6 space-y-2.5 text-sm">
                  {p.features.map((ft) => (
                    <li key={ft} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      <span>{ft}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link to="/dashboard" className="mt-8 inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground">
                Open Workspace
              </Link>
            </div>
          ))}
        </div>
      </Section>
    </SiteLayout>
  );
}
