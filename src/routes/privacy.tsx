import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Section, SectionHeader } from "@/components/site/Section";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy Policy — OFC360" }] }),
  component: () => (
    <SiteLayout>
      <Section>
        <SectionHeader eyebrow="Legal" title="Privacy Policy" />
        <div className="mt-8 max-w-3xl mx-auto text-sm text-muted-foreground space-y-4">
          <p>OFC360 is committed to protecting organizational and employee data with enterprise-grade privacy controls.</p>
        </div>
      </Section>
    </SiteLayout>
  ),
});
