import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";

import { aurix, useAurix } from "@/lib/aurix-store";

import { employeeOnboardingApi } from "@/services/employeeOnboardingApi";
import { getPostLoginRoute } from "@/lib/auth-bootstrap";

import { OnboardingProgressBar } from "@/features/employee-onboarding/components/OnboardingProgressBar";
import { OnboardingSkeleton } from "@/features/employee-onboarding/components/OnboardingSkeleton";

// Steps Components
import { PersonalInfoStep } from "@/features/employee-onboarding/components/steps/PersonalInfoStep";
import { IdentityVerificationStep } from "@/features/employee-onboarding/components/steps/IdentityVerificationStep";
import { EmploymentDetailsStep } from "@/features/employee-onboarding/components/steps/EmploymentDetailsStep";
import { EducationStep } from "@/features/employee-onboarding/components/steps/EducationStep";
import { ExperienceStep } from "@/features/employee-onboarding/components/steps/ExperienceStep";
import { BankDetailsStep } from "@/features/employee-onboarding/components/steps/BankDetailsStep";
import { TaxPayrollStep } from "@/features/employee-onboarding/components/steps/TaxPayrollStep";
import { DocumentsUploadStep } from "@/features/employee-onboarding/components/steps/DocumentsUploadStep";
import { PoliciesStep } from "@/features/employee-onboarding/components/steps/PoliciesStep";
import { FinalReviewStep } from "@/features/employee-onboarding/components/steps/FinalReviewStep";

export const Route = createFileRoute("/employee-onboarding")({
  head: () => ({ meta: [{ title: "Employee Onboarding Wizard — Aurix" }] }),
  component: EmployeeOnboardingPage,
});

const STEPS_LABELS = [
  "Personal Info",
  "Identity",
  "Employment",
  "Education",
  "Experience",
  "Bank Details",
  "Tax & Nominee",
  "Documents",
  "Policies",
  "Final Review"
];

function EmployeeOnboardingPage() {
  const ws = useAurix();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [initialData, setInitialData] = useState<any>(null);

  const fetchProgress = async () => {
    try {
      const response = await employeeOnboardingApi.getProgress();
      if (response.success) {
        setInitialData(response.data);
        setCurrentStep(response.current_step || 1);
      } else {
        toast.error("Failed to load onboarding progress.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // If not logged in, redirect to login
    if (!ws.user) {
      navigate({ to: "/login" });
      return;
    }

    // If onboarding is already complete, redirect to dashboard
    if (ws.user.onboardingComplete) {
      const postLoginRoute = getPostLoginRoute({
        id: ws.user.id,
        name: ws.user.fullName,
        email: ws.user.email,
        phone: ws.user.phone,
        role: ws.user.role as any,
        company_id: ws.user.companyId,
        is_verified: ws.user.emailVerified,
        onboarding_completed: true
      });
      navigate({ to: postLoginRoute });
      return;
    }

    fetchProgress();
  }, [ws.user]);

  const handleNext = () => {
    const next = Math.min(10, currentStep + 1);
    setCurrentStep(next);
    fetchProgress();
  };

  const handlePrev = () => {
    const prev = Math.max(1, currentStep - 1);
    setCurrentStep(prev);
    fetchProgress();
  };

  const handleJumpToStep = (stepOrder: number) => {
    setCurrentStep(stepOrder);
  };

  const handleComplete = () => {
    // Force reload/refresh auth store state
    aurix.set({
      user: ws.user ? { ...ws.user, onboardingComplete: true } : null
    });

    
    const postLoginRoute = getPostLoginRoute({
      id: ws.user?.id || "",
      name: ws.user?.fullName || "",
      email: ws.user?.email || "",
      phone: ws.user?.phone || "",
      role: ws.user?.role as any,
      company_id: ws.user?.companyId || "",
      is_verified: ws.user?.emailVerified || false,
      onboarding_completed: true
    });
    navigate({ to: postLoginRoute });
  };

  if (loading) {
    return <OnboardingSkeleton />;
  }

  const percentage = ((currentStep - 1) / 9) * 100;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep initialData={initialData?.personal_info} onNext={handleNext} />;
      case 2:
        return (
          <IdentityVerificationStep
            initialData={initialData}
            onNext={handleNext}
            onPrev={handlePrev}
            refetchData={fetchProgress}
          />
        );
      case 3:
        return (
          <EmploymentDetailsStep
            initialData={initialData}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        );
      case 4:
        return (
          <EducationStep
            initialData={initialData}
            onNext={handleNext}
            onPrev={handlePrev}
            refetchData={fetchProgress}
          />
        );
      case 5:
        return (
          <ExperienceStep
            initialData={initialData}
            onNext={handleNext}
            onPrev={handlePrev}
            refetchData={fetchProgress}
          />
        );
      case 6:
        return (
          <BankDetailsStep
            initialData={initialData}
            onNext={handleNext}
            onPrev={handlePrev}
            refetchData={fetchProgress}
          />
        );
      case 7:
        return (
          <TaxPayrollStep
            initialData={initialData}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        );
      case 8:
        return (
          <DocumentsUploadStep
            initialData={initialData}
            onNext={handleNext}
            onPrev={handlePrev}
            refetchData={fetchProgress}
          />
        );
      case 9:
        return (
          <PoliciesStep
            initialData={initialData}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        );
      case 10:
        return (
          <FinalReviewStep
            initialData={initialData}
            onJumpToStep={handleJumpToStep}
            onComplete={handleComplete}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-10 px-4 sm:px-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight">Aurix HRMS</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Enterprise Employee Onboarding Portal</p>
          </div>
        </div>

        {/* Top Progress Indicator */}
        <OnboardingProgressBar
          currentStep={currentStep}
          totalSteps={10}
          percentage={percentage}
        />

        {/* Wizard form steps */}
        <div className="rounded-2xl border border-border/40 bg-card/60 p-6 sm:p-8 backdrop-blur-xl shadow-lg relative overflow-hidden">
          <div className="mb-6">
            <h2 className="text-xl font-bold">{STEPS_LABELS[currentStep - 1]}</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Please complete all required fields for this section.
            </p>
          </div>
          <hr className="border-border/40 mb-6" />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.25 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
