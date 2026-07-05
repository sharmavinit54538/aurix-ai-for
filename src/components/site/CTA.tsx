import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Section } from "./Section";

export function CTA({
  title = "Ready to ship faster?",
  subtitle = "Join thousands of teams using Aurix to build, launch, and scale their products.",
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <Section>
      <div className="relative overflow-hidden rounded-3xl border border-border p-8 sm:p-16 text-center">
        <div className="absolute inset-0 bg-gradient-brand opacity-10" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-64 w-[600px] bg-gradient-brand blur-3xl opacity-40" />
        <div className="relative">
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">{title}</h2>
          <p className="mt-5 text-muted-foreground max-w-xl mx-auto">{subtitle}</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-brand text-brand-foreground font-medium shadow-glow hover:opacity-90 transition-opacity">
              Get started free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/contact" className="inline-flex items-center justify-center px-6 py-3 rounded-xl glass font-medium hover:bg-secondary transition-colors">
              Talk to sales
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}

