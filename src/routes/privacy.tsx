import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Section } from "@/components/site/Section";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Aurix" },
      { name: "description", content: "How Aurix collects, uses, and protects your data." },
      { property: "og:title", content: "Privacy Policy — Aurix" },
      { property: "og:url", content: "/privacy" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: PrivacyPage,
});

const sections = [
  { h: "1. Introduction", p: "Aurix Inc. (\"Aurix\", \"we\", \"us\") respects your privacy. This Privacy Policy describes how we collect, use, disclose, and protect your information when you use our products and services." },
  { h: "2. Information we collect", p: "We collect information you provide directly (account information, content you create), information collected automatically (device, log, and usage data), and information from third parties (integrations you authorize)." },
  { h: "3. How we use information", p: "We use information to provide and improve our services, communicate with you, ensure security and compliance, and develop new features." },
  { h: "4. Sharing of information", p: "We do not sell your personal information. We share information with service providers under contract, when required by law, or in connection with a merger or acquisition." },
  { h: "5. Data retention", p: "We retain your information for as long as your account is active and as needed to provide services, comply with legal obligations, and resolve disputes." },
  { h: "6. Your rights", p: "Depending on your jurisdiction, you may have rights to access, correct, delete, port, or restrict processing of your personal information. Contact privacy@aurix.com to exercise these rights." },
  { h: "7. Security", p: "We employ industry-standard technical and organizational measures, including SOC 2 Type II controls, encryption in transit and at rest, and continuous security monitoring." },
  { h: "8. International transfers", p: "Your information may be processed in countries other than your own. Where required, we use Standard Contractual Clauses or other valid transfer mechanisms." },
  { h: "9. Children", p: "Aurix is not directed to children under 16 and we do not knowingly collect information from them." },
  { h: "10. Changes to this policy", p: "We may update this policy from time to time. Material changes will be communicated in advance via email or in-product notice." },
  { h: "11. Contact", p: "Questions? Contact us at privacy@aurix.com or write to Aurix Inc., Rua Augusta 100, Lisbon, Portugal." },
];

function PrivacyPage() {
  return (
    <SiteLayout>
      <Section className="max-w-3xl">
        <p className="text-sm text-brand font-medium">Legal</p>
        <h1 className="mt-2 font-display text-4xl sm:text-5xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="mt-4 text-muted-foreground">Last updated: June 1, 2026</p>

        <div className="mt-12 space-y-10">
          {sections.map((s) => (
            <div key={s.h}>
              <h2 className="font-display text-xl font-bold">{s.h}</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">{s.p}</p>
            </div>
          ))}
        </div>
      </Section>
    </SiteLayout>
  );
}
