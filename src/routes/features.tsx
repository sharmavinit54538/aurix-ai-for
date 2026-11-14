import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Section, SectionHeader } from "@/components/site/Section";
import { CTA } from "@/components/site/CTA";
import { Sparkles, Users, ShieldCheck, BarChart3, Lock, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/features")({
  head: () => ({ meta: [{ title: "Features — OFC360" }] }),
  component: FeaturesPage,
});

const FEATURES = [
  { icon: Sparkles, title: "AI-First HR Operations", desc: "Automate screening, policy Q&A, and workforce analytics with built-in AI agents." },
  { icon: Users, title: "Unified Workforce Hub", desc: "Manage employees, org hierarchies, attendance, shifts, and leaves in one place." },
  { icon: BarChart3, title: "Enterprise Payroll", desc: "End-to-end payroll processing, statutory compliance, and automated payslip distribution." },
  { icon: MessageSquare, title: "Threaded Discussions", desc: "Discuss in context with integrated Connect channels, voice, and video meetings." },
  { icon: Lock, title: "Granular Permissions", desc: "Role-based access across Super Admin, HR Admin, Manager, Recruiter, IT, and Employee portals." },
  { icon: ShieldCheck, title: "Continuous Compliance", desc: "Automated audit trails, maker-checker approvals, and real-time risk alerts." },
];

function FeaturesPage() {
  return (
    <SiteLayout>
      <Section>
        <SectionHeader eyebrow="Capabilities" title="Everything modern enterprise teams need" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="glass rounded-2xl p-6">
              <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-gradient-brand shadow-glow">
                <f.icon className="h-5 w-5 text-brand-foreground" />
              </div>
              <h3 className="font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </Section>
      <CTA />
    </SiteLayout>
  );
}
