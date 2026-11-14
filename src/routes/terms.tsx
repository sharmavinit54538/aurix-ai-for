import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Section, SectionHeader } from "@/components/site/Section";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Terms of Service — OFC360" }] }),
  component: () => (
    <SiteLayout>
      <Section>
        <SectionHeader eyebrow="Legal" title="Terms of Service" />
        <div className="mt-8 max-w-3xl mx-auto text-sm text-muted-foreground space-y-4">
          <p>By using the OFC360 platform, you agree to comply with organizational security and acceptable use policies.</p>
        </div>
      </Section>
    </SiteLayout>
  ),
});
