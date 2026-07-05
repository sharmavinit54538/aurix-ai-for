import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MapPin, Phone, MessageSquare, Send } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Section, SectionHeader } from "@/components/site/Section";
import { FAQ } from "@/components/site/FAQ";
import { CTA } from "@/components/site/CTA";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Aurix" },
      { name: "description", content: "Get in touch with the Aurix team. We respond within one business day." },
      { property: "og:title", content: "Contact — Aurix" },
      { property: "og:description", content: "Talk to the Aurix team." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

const offices = [
  { city: "Lisbon", region: "HQ · Europe", address: "Rua Augusta 100, Lisbon, Portugal" },
  { city: "San Francisco", region: "Americas", address: "535 Mission St, San Francisco, CA" },
  { city: "Singapore", region: "APAC", address: "1 Raffles Place, Singapore" },
];

const faqs = [
  { q: "How quickly will you respond?", a: "Within one business day, usually faster." },
  { q: "Do you offer demos?", a: "Yes — pick a time on the form and we'll set up a live walkthrough tailored to your team." },
  { q: "Is there a phone number?", a: "Yes, our sales team is reachable at +1 (415) 555-0142 during business hours PT." },
];

function ContactPage() {
  const [sending, setSending] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast.success("Message sent — we'll be in touch shortly.");
      (e.target as HTMLFormElement).reset();
    }, 800);
  }

  return (
    <SiteLayout>
      <Toaster />
      <Section>
        <SectionHeader eyebrow="Contact" title="Let's talk" subtitle="Tell us what you're building and we'll get back to you within a business day." />

        <div className="mt-16 grid lg:grid-cols-5 gap-8">
          {/* Form */}
          <form onSubmit={onSubmit} className="lg:col-span-3 glass rounded-3xl p-8">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Full name" name="name" placeholder="Jane Doe" required />
              <Field label="Work email" name="email" type="email" placeholder="jane@company.com" required />
              <Field label="Company" name="company" placeholder="Acme Inc" />
              <Field label="Team size" name="size" placeholder="1-10, 11-50…" />
            </div>
            <div className="mt-4">
              <label className="text-sm font-medium">Message</label>
              <textarea
                name="message"
                rows={5}
                required
                placeholder="Tell us what you're hoping to do with Aurix…"
                className="mt-2 w-full rounded-xl bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-brand text-brand-foreground font-medium shadow-glow hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {sending ? "Sending…" : "Send message"} <Send className="h-4 w-4" />
            </button>
          </form>

          {/* Info */}
          <div className="lg:col-span-2 space-y-4">
            {[
              { icon: Mail, label: "Email", value: "hello@aurix.com" },
              { icon: Phone, label: "Phone", value: "+1 (415) 555-0142" },
              { icon: MessageSquare, label: "Sales", value: "sales@aurix.com" },
              { icon: MapPin, label: "Headquarters", value: "Lisbon, Portugal" },
            ].map((b) => (
              <div key={b.label} className="glass rounded-2xl p-5 flex items-start gap-4">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-gradient-brand grid place-items-center">
                  <b.icon className="h-4 w-4 text-brand-foreground" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">{b.label}</div>
                  <div className="font-medium">{b.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Offices */}
      <Section>
        <SectionHeader eyebrow="Offices" title="Where you'll find us" />
        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {offices.map((o) => (
            <div key={o.city} className="glass rounded-2xl p-6">
              <div className="text-sm text-brand">{o.region}</div>
              <div className="font-display text-2xl font-bold mt-1">{o.city}</div>
              <p className="text-sm text-muted-foreground mt-3">{o.address}</p>
            </div>
          ))}
        </div>
      </Section>

      <FAQ items={faqs} />
      <CTA />
    </SiteLayout>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        {...props}
        className="mt-2 w-full rounded-xl bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}
