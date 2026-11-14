import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Section, SectionHeader } from "@/components/site/Section";
import { FAQ } from "@/components/site/FAQ";

export const Route = createFileRoute("/faq")({
  head: () => ({ meta: [{ title: "FAQ — OFC360" }] }),
  component: () => (
    <SiteLayout>
      <Section>
        <SectionHeader eyebrow="FAQ" title="Frequently Asked Questions" />
        <div className="mt-10">
          <FAQ />
        </div>
      </Section>
    </SiteLayout>
  ),
});
