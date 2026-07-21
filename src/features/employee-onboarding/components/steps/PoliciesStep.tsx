import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";
import { employeeOnboardingApi } from "@/services/employeeOnboardingApi";

interface PoliciesStepProps {
  initialData: any;
  onNext: () => void;
  onPrev: () => void;
}

const POLICY_LIST = [
  { key: "handbook", name: "Employee Handbook", text: "Welcome to our company! This handbook contains general guidelines regarding work hours, holidays, corporate behavior, and overall expectations." },
  { key: "hr_policy", name: "HR Policies & leave policy", text: "This policy details working shifts, leave request workflows, emergency absences, and probation requirements." },
  { key: "remote_work", name: "Remote Work & Attendance Policy", text: "Our remote/hybrid work policies enforce correct time reporting, visual presence during online meetings, and strict data security protocols." },
  { key: "it_security", name: "IT Security & Data Privacy Policy", text: "All hardware devices and cloud accounts are monitored. Do not share credentials or transmit sensitive company/customer records via unsafe channels." },
  { key: "nda", name: "Non-Disclosure Agreement (NDA)", text: "You agree not to publish, communicate or leverage any corporate intellectual property, codebase, internal designs or customer profiles outside of working hours." },
  { key: "conduct", name: "Code of Conduct & POSH Policy", text: "We enforce zero tolerance for harassment, bullying, or discrimination. Discrimination or harassment under POSH/Equal Opportunity guidelines is grounds for immediate termination." },
  { key: "agreement", name: "Employment Agreement", text: "By signing, you validate the employment terms detailed in your offer letter including CTC, reporting managers, and statutory declarations." }
];

export function PoliciesStep({ initialData, onNext, onPrev }: PoliciesStepProps) {
  const [acceptances, setAcceptances] = useState<Record<string, boolean>>(
    POLICY_LIST.reduce((acc, p) => {
      const isAccepted = initialData?.policies?.some((pol: any) => pol.policy_name === p.name);
      acc[p.key] = !!isAccepted;
      return acc;
    }, {} as Record<string, boolean>)
  );
  
  const [signature, setSignature] = useState(
    initialData?.policies?.[0]?.digital_signature || ""
  );

  const handleCheckboxChange = (key: string, checked: boolean) => {
    setAcceptances({ ...acceptances, [key]: checked });
  };

  const handleAcceptAll = () => {
    const updated = { ...acceptances };
    POLICY_LIST.forEach((p) => {
      updated[p.key] = true;
    });
    setAcceptances(updated);
  };

  const handleSave = async () => {
    const allAccepted = POLICY_LIST.every((p) => acceptances[p.key]);
    if (!allAccepted) {
      toast.error("Please read and accept all policy agreements to proceed.");
      return;
    }

    if (!signature.trim()) {
      toast.error("Please type your full name in the Digital Signature field.");
      return;
    }

    const payload = POLICY_LIST.map((p) => ({
      policy_name: p.name,
      accepted: true,
      digital_signature: signature
    }));

    try {
      const response = await employeeOnboardingApi.saveStep9({ acceptances: payload });
      if (response.success) {
        toast.success("All corporate policies signed and accepted.");
        onNext();
      } else {
        toast.error(response.message || "Failed to save policy logs.");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-foreground">Policies & Signed Agreements</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Click on each agreement to read. You must accept all clauses below.
          </p>
        </div>
        <Button variant="outline" size="sm" type="button" onClick={handleAcceptAll}>
          Accept All Policies
        </Button>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-2">
        {POLICY_LIST.map((policy) => (
          <AccordionItem
            key={policy.key}
            value={policy.key}
            className="rounded-lg border border-border/40 bg-card/40 px-4 backdrop-blur-md"
          >
            <div className="flex items-center gap-3">
              <Checkbox
                id={`chk_${policy.key}`}
                checked={acceptances[policy.key]}
                onCheckedChange={(checked) => handleCheckboxChange(policy.key, !!checked)}
              />
              <AccordionTrigger className="hover:no-underline flex-1 py-4 font-semibold text-foreground text-left">
                {policy.name}
              </AccordionTrigger>
            </div>
            <AccordionContent className="pb-4 pt-1 text-sm text-muted-foreground border-t border-border/20 mt-1">
              <div className="space-y-2 leading-relaxed">
                <p>{policy.text}</p>
                <p className="text-xs italic">By checking the box above, I confirm that I have read, understood, and agree to remain fully compliant with this policy.</p>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Signature Area */}
      <div className="rounded-xl border border-border/40 bg-card/60 p-6 backdrop-blur-md space-y-4">
        <h4 className="font-bold text-foreground">Digital Signature Consent</h4>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-1">
            <Label className="font-bold text-foreground">Type your Full Name *</Label>
            <Input
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              placeholder="e.g. John Doe"
              className="font-serif italic text-lg"
            />
            <p className="text-xs text-muted-foreground">
              Typing your name acts as your legal binding digital signature.
            </p>
          </div>
          <div className="space-y-1">
            <Label className="font-bold text-foreground">Signing Date</Label>
            <Input value={new Date().toLocaleDateString()} disabled className="bg-muted" />
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onPrev}>
          Previous
        </Button>
        <Button type="button" onClick={handleSave}>
          Sign & Continue
        </Button>
      </div>
    </div>
  );
}
