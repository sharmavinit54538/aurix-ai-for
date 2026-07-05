import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Section, SectionHeader } from "./Section";

export type FAQItem = { q: string; a: string };

export function FAQ({
  items,
  title = "Frequently asked questions",
  subtitle = "Everything you need to know about Aurix.",
  eyebrow = "FAQ",
}: {
  items: FAQItem[];
  title?: string;
  subtitle?: string;
  eyebrow?: string;
}) {
  return (
    <Section>
      <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
      <div className="mt-12 max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="space-y-3">
          {items.map((item, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="glass rounded-2xl px-5 border-none"
            >
              <AccordionTrigger className="text-left font-medium hover:no-underline py-5">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  );
}
