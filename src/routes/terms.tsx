import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Section } from "@/components/site/Section";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Aurix" },
      { name: "description", content: "The terms that govern your use of Aurix." },
      { property: "og:title", content: "Terms & Conditions — Aurix" },
      { property: "og:url", content: "/terms" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: TermsPage,
});

const sections = [
  { h: "1. Acceptance of terms", p: "By accessing or using Aurix, you agree to be bound by these Terms & Conditions and our Privacy Policy. If you do not agree, do not use the service." },
  { h: "2. Use of the service", p: "You may use Aurix only in compliance with these terms and all applicable laws. You are responsible for the activities that occur under your account." },
  { h: "3. Accounts", p: "You must provide accurate information when creating an account and keep your credentials confidential. You are responsible for all activity on your account." },
  { h: "4. Subscriptions and billing", p: "Paid plans are billed in advance on a recurring basis. Fees are non-refundable except where required by law." },
  { h: "5. Acceptable use", p: "You agree not to misuse the service, including but not limited to: reverse engineering, distributing malware, infringing intellectual property, or harassing other users." },
  { h: "6. Intellectual property", p: "Aurix retains all rights in the service. You retain all rights to content you create. You grant us a limited license to host and display your content as needed to provide the service." },
  { h: "7. Termination", p: "We may suspend or terminate your account for violations of these terms. You may cancel your account at any time." },
  { h: "8. Disclaimers", p: "The service is provided \"as is\" without warranties of any kind. To the maximum extent permitted by law, Aurix disclaims all warranties, express or implied." },
  { h: "9. Limitation of liability", p: "Aurix's liability is limited to the fees you paid in the twelve months prior to the event giving rise to the claim." },
  { h: "10. Changes to terms", p: "We may modify these terms from time to time. Continued use of the service constitutes acceptance of the modified terms." },
  { h: "11. Governing law", p: "These terms are governed by the laws of Portugal, without regard to its conflict of law principles." },
  { h: "12. Contact", p: "Questions about these terms? Contact legal@aurix.com." },
];

function TermsPage() {
  return (
    <SiteLayout>
      <Section className="max-w-3xl">
        <p className="text-sm text-brand font-medium">Legal</p>
        <h1 className="mt-2 font-display text-4xl sm:text-5xl font-bold tracking-tight">Terms & Conditions</h1>
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
