import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MANAGER_FORM_EMPLOYMENT_TYPE_OPTIONS } from "@/features/admin/managers/constants";
import type { EmployeeFormState } from "../employeesTypes";
import {
  EMPTY_ADDRESS,
  EMPTY_BANK_ACCOUNT,
  EMPTY_DOCUMENT,
  EMPTY_EDUCATION,
  EMPTY_EMERGENCY_CONTACT,
  EMPTY_EXPERIENCE,
  EMPTY_SKILL,
} from "../utils/employeeForm";

const ADDRESS_TYPE_OPTIONS = ["CURRENT", "PERMANENT", "OFFICE"] as const;
const ACCOUNT_TYPE_OPTIONS = ["SAVINGS", "CURRENT"] as const;
const PROFICIENCY_OPTIONS = ["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"] as const;

interface EmployeeFormArraySectionsProps {
  draft: EmployeeFormState;
  onDraftChange: (draft: EmployeeFormState) => void;
}

type ArrayFieldName =
  | "addresses"
  | "documents"
  | "education"
  | "experience"
  | "skills"
  | "emergency_contacts"
  | "bank_accounts";

export function EmployeeFormArraySections({ draft, onDraftChange }: EmployeeFormArraySectionsProps) {
  const updateArray = (field: ArrayFieldName, index: number, value: Record<string, unknown>) => {
    const items = [...(draft[field] as unknown[])] as Array<Record<string, unknown>>;
    items[index] = { ...items[index], ...value };
    onDraftChange({ ...draft, [field]: items });
  };

  const addItem = (field: ArrayFieldName, empty: Record<string, unknown>) => {
    onDraftChange({ ...draft, [field]: [...(draft[field] as unknown[]), empty] });
  };

  const removeItem = (field: ArrayFieldName, index: number) => {
    const items = [...(draft[field] as unknown[])];
    items.splice(index, 1);
    onDraftChange({ ...draft, [field]: items });
  };

  return (
    <>
      <ArraySection
        title="Addresses"
        onAdd={() => addItem("addresses", { ...EMPTY_ADDRESS })}
        empty={draft.addresses.length === 0}
      >
        {draft.addresses.map((item, index) => (
          <ArrayCard key={index} title={`Address ${index + 1}`} onRemove={() => removeItem("addresses", index)}>
            <ArrayField label="Address type">
              <Select
                value={item.address_type || undefined}
                onValueChange={(v) => updateArray("addresses", index, { address_type: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {ADDRESS_TYPE_OPTIONS.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </ArrayField>
            <ArrayField label="Address line 1">
              <Input
                value={item.address_line_1}
                onChange={(e) => updateArray("addresses", index, { address_line_1: e.target.value })}
              />
            </ArrayField>
            <ArrayField label="Address line 2">
              <Input
                value={item.address_line_2}
                onChange={(e) => updateArray("addresses", index, { address_line_2: e.target.value })}
              />
            </ArrayField>
            <ArrayField label="City">
              <Input value={item.city} onChange={(e) => updateArray("addresses", index, { city: e.target.value })} />
            </ArrayField>
            <ArrayField label="State">
              <Input value={item.state} onChange={(e) => updateArray("addresses", index, { state: e.target.value })} />
            </ArrayField>
            <ArrayField label="Country">
              <Input
                value={item.country}
                onChange={(e) => updateArray("addresses", index, { country: e.target.value })}
              />
            </ArrayField>
            <ArrayField label="Pincode">
              <Input
                value={item.pincode}
                onChange={(e) => updateArray("addresses", index, { pincode: e.target.value })}
              />
            </ArrayField>
            <div className="flex items-center gap-2 md:col-span-2 lg:col-span-3">
              <Checkbox
                id={`address-same-${index}`}
                checked={item.is_same_as_current}
                onCheckedChange={(checked) =>
                  updateArray("addresses", index, { is_same_as_current: !!checked })
                }
              />
              <Label htmlFor={`address-same-${index}`} className="text-xs font-normal">
                Same as current address
              </Label>
            </div>
          </ArrayCard>
        ))}
      </ArraySection>

      <ArraySection
        title="Documents"
        onAdd={() => addItem("documents", { ...EMPTY_DOCUMENT })}
        empty={draft.documents.length === 0}
      >
        {draft.documents.map((item, index) => (
          <ArrayCard key={index} title={`Document ${index + 1}`} onRemove={() => removeItem("documents", index)}>
            <ArrayField label="Document type">
              <Input
                value={item.document_type}
                onChange={(e) => updateArray("documents", index, { document_type: e.target.value })}
                placeholder="e.g. AADHAAR, PAN"
              />
            </ArrayField>
            <ArrayField label="Document number">
              <Input
                value={item.document_number}
                onChange={(e) => updateArray("documents", index, { document_number: e.target.value })}
              />
            </ArrayField>
            <ArrayField label="Document URL">
              <Input
                value={item.document_url}
                onChange={(e) => updateArray("documents", index, { document_url: e.target.value })}
              />
            </ArrayField>
            <ArrayField label="Expiry date">
              <Input
                type="date"
                value={item.expiry_date}
                onChange={(e) => updateArray("documents", index, { expiry_date: e.target.value })}
              />
            </ArrayField>
          </ArrayCard>
        ))}
      </ArraySection>

      <ArraySection
        title="Education"
        onAdd={() => addItem("education", { ...EMPTY_EDUCATION })}
        empty={draft.education.length === 0}
      >
        {draft.education.map((item, index) => (
          <ArrayCard key={index} title={`Education ${index + 1}`} onRemove={() => removeItem("education", index)}>
            <ArrayField label="Degree">
              <Input
                value={item.degree}
                onChange={(e) => updateArray("education", index, { degree: e.target.value })}
              />
            </ArrayField>
            <ArrayField label="Institution">
              <Input
                value={item.institution}
                onChange={(e) => updateArray("education", index, { institution: e.target.value })}
              />
            </ArrayField>
            <ArrayField label="Field of study">
              <Input
                value={item.field_of_study}
                onChange={(e) => updateArray("education", index, { field_of_study: e.target.value })}
              />
            </ArrayField>
            <ArrayField label="Start year">
              <Input
                type="number"
                value={item.start_year || ""}
                onChange={(e) => updateArray("education", index, { start_year: Number(e.target.value) || 0 })}
              />
            </ArrayField>
            <ArrayField label="End year">
              <Input
                type="number"
                value={item.end_year || ""}
                onChange={(e) => updateArray("education", index, { end_year: Number(e.target.value) || 0 })}
              />
            </ArrayField>
            <ArrayField label="Grade">
              <Input
                value={item.grade}
                onChange={(e) => updateArray("education", index, { grade: e.target.value })}
              />
            </ArrayField>
            <ArrayField label="Certificate URL" wide>
              <Input
                value={item.certificate_url}
                onChange={(e) => updateArray("education", index, { certificate_url: e.target.value })}
              />
            </ArrayField>
          </ArrayCard>
        ))}
      </ArraySection>

      <ArraySection
        title="Experience"
        onAdd={() => addItem("experience", { ...EMPTY_EXPERIENCE })}
        empty={draft.experience.length === 0}
      >
        {draft.experience.map((item, index) => (
          <ArrayCard key={index} title={`Experience ${index + 1}`} onRemove={() => removeItem("experience", index)}>
            <ArrayField label="Company name">
              <Input
                value={item.company_name}
                onChange={(e) => updateArray("experience", index, { company_name: e.target.value })}
              />
            </ArrayField>
            <ArrayField label="Designation">
              <Input
                value={item.designation}
                onChange={(e) => updateArray("experience", index, { designation: e.target.value })}
              />
            </ArrayField>
            <ArrayField label="Employment type">
              <Select
                value={item.employment_type || undefined}
                onValueChange={(v) => updateArray("experience", index, { employment_type: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {MANAGER_FORM_EMPLOYMENT_TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </ArrayField>
            <ArrayField label="Start date">
              <Input
                type="date"
                value={item.start_date}
                onChange={(e) => updateArray("experience", index, { start_date: e.target.value })}
              />
            </ArrayField>
            <ArrayField label="End date">
              <Input
                type="date"
                value={item.end_date}
                disabled={item.is_current}
                onChange={(e) => updateArray("experience", index, { end_date: e.target.value })}
              />
            </ArrayField>
            <div className="flex items-center gap-2">
              <Checkbox
                id={`experience-current-${index}`}
                checked={item.is_current}
                onCheckedChange={(checked) =>
                  updateArray("experience", index, {
                    is_current: !!checked,
                    end_date: checked ? "" : item.end_date,
                  })
                }
              />
              <Label htmlFor={`experience-current-${index}`} className="text-xs font-normal">
                Current job
              </Label>
            </div>
            <ArrayField label="Description" wide>
              <Input
                value={item.description}
                onChange={(e) => updateArray("experience", index, { description: e.target.value })}
              />
            </ArrayField>
          </ArrayCard>
        ))}
      </ArraySection>

      <ArraySection
        title="Skills"
        onAdd={() => addItem("skills", { ...EMPTY_SKILL })}
        empty={draft.skills.length === 0}
      >
        {draft.skills.map((item, index) => (
          <ArrayCard key={index} title={`Skill ${index + 1}`} onRemove={() => removeItem("skills", index)}>
            <ArrayField label="Skill name">
              <Input
                value={item.skill_name}
                onChange={(e) => updateArray("skills", index, { skill_name: e.target.value })}
              />
            </ArrayField>
            <ArrayField label="Proficiency">
              <Select
                value={item.proficiency || undefined}
                onValueChange={(v) => updateArray("skills", index, { proficiency: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select proficiency" />
                </SelectTrigger>
                <SelectContent>
                  {PROFICIENCY_OPTIONS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </ArrayField>
            <ArrayField label="Years of experience">
              <Input
                type="number"
                min={0}
                value={item.years_of_experience || ""}
                onChange={(e) =>
                  updateArray("skills", index, { years_of_experience: Number(e.target.value) || 0 })
                }
              />
            </ArrayField>
          </ArrayCard>
        ))}
      </ArraySection>

      <ArraySection
        title="Emergency contacts"
        onAdd={() => addItem("emergency_contacts", { ...EMPTY_EMERGENCY_CONTACT })}
        empty={draft.emergency_contacts.length === 0}
      >
        {draft.emergency_contacts.map((item, index) => (
          <ArrayCard
            key={index}
            title={`Emergency contact ${index + 1}`}
            onRemove={() => removeItem("emergency_contacts", index)}
          >
            <ArrayField label="Name">
              <Input
                value={item.name}
                onChange={(e) => updateArray("emergency_contacts", index, { name: e.target.value })}
              />
            </ArrayField>
            <ArrayField label="Relation">
              <Input
                value={item.relation}
                onChange={(e) => updateArray("emergency_contacts", index, { relation: e.target.value })}
              />
            </ArrayField>
            <ArrayField label="Phone">
              <Input
                value={item.phone}
                onChange={(e) => updateArray("emergency_contacts", index, { phone: e.target.value })}
              />
            </ArrayField>
            <ArrayField label="Alternate phone">
              <Input
                value={item.alternate_phone}
                onChange={(e) => updateArray("emergency_contacts", index, { alternate_phone: e.target.value })}
              />
            </ArrayField>
            <ArrayField label="Email">
              <Input
                type="email"
                value={item.email}
                onChange={(e) => updateArray("emergency_contacts", index, { email: e.target.value })}
              />
            </ArrayField>
            <ArrayField label="Address" wide>
              <Input
                value={item.address}
                onChange={(e) => updateArray("emergency_contacts", index, { address: e.target.value })}
              />
            </ArrayField>
          </ArrayCard>
        ))}
      </ArraySection>

      <ArraySection
        title="Bank accounts"
        onAdd={() => addItem("bank_accounts", { ...EMPTY_BANK_ACCOUNT })}
        empty={draft.bank_accounts.length === 0}
      >
        {draft.bank_accounts.map((item, index) => (
          <ArrayCard
            key={index}
            title={`Bank account ${index + 1}`}
            onRemove={() => removeItem("bank_accounts", index)}
          >
            <ArrayField label="Bank name">
              <Input
                value={item.bank_name}
                onChange={(e) => updateArray("bank_accounts", index, { bank_name: e.target.value })}
              />
            </ArrayField>
            <ArrayField label="Account holder name">
              <Input
                value={item.account_holder_name}
                onChange={(e) => updateArray("bank_accounts", index, { account_holder_name: e.target.value })}
              />
            </ArrayField>
            <ArrayField label="Account number">
              <Input
                value={item.account_number}
                onChange={(e) => updateArray("bank_accounts", index, { account_number: e.target.value })}
              />
            </ArrayField>
            <ArrayField label="IFSC code">
              <Input
                value={item.ifsc_code}
                onChange={(e) => updateArray("bank_accounts", index, { ifsc_code: e.target.value })}
              />
            </ArrayField>
            <ArrayField label="Account type">
              <Select
                value={item.account_type || undefined}
                onValueChange={(v) => updateArray("bank_accounts", index, { account_type: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  {ACCOUNT_TYPE_OPTIONS.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </ArrayField>
            <div className="flex items-center gap-2">
              <Checkbox
                id={`bank-primary-${index}`}
                checked={item.is_primary}
                onCheckedChange={(checked) =>
                  updateArray("bank_accounts", index, { is_primary: !!checked })
                }
              />
              <Label htmlFor={`bank-primary-${index}`} className="text-xs font-normal">
                Primary account
              </Label>
            </div>
          </ArrayCard>
        ))}
      </ArraySection>
    </>
  );
}

function ArraySection({
  title,
  children,
  onAdd,
  empty,
}: {
  title: string;
  children: React.ReactNode;
  onAdd: () => void;
  empty: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
        <Button type="button" variant="outline" size="sm" onClick={onAdd}>
          <Plus className="mr-1 h-3.5 w-3.5" />
          Add
        </Button>
      </div>
      {empty ? (
        <p className="rounded-xl border border-dashed border-border/60 px-4 py-6 text-center text-xs text-muted-foreground">
          No {title.toLowerCase()} added yet.
        </p>
      ) : (
        <div className="space-y-4">{children}</div>
      )}
      <hr className="border-border/60" />
    </div>
  );
}

function ArrayCard({
  title,
  children,
  onRemove,
}: {
  title: string;
  children: React.ReactNode;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/10 p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm font-medium">{title}</p>
        <Button type="button" variant="ghost" size="sm" onClick={onRemove} className="h-8 text-rose-500">
          <Trash2 className="mr-1 h-3.5 w-3.5" />
          Remove
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">{children}</div>
    </div>
  );
}

function ArrayField({
  label,
  children,
  wide,
}: {
  label: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={`space-y-1.5 ${wide ? "md:col-span-2 lg:col-span-3" : ""}`}>
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}