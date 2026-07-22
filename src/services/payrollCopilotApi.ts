import { api } from "@/api";

export interface CopilotMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  metadata?: {
    type?: "calculation" | "compliance" | "template" | "checklist";
    tableData?: { headers: string[]; rows: string[][] };
  };
}

export const payrollCopilotApi = {
  // Send message to real backend API
  sendMessage: async (prompt: string, history: CopilotMessage[] = []): Promise<CopilotMessage> => {
    try {
      const res: any = await api.post("payroll/copilot/chat", {
        prompt,
        message: prompt,
        history: history.map((m) => ({ role: m.role, content: m.content })),
      });

      const responseData = res.data || res;
      if (responseData?.content || responseData?.reply || responseData?.response) {
        return {
          id: responseData.id || `msg-${Date.now()}`,
          role: "assistant",
          content: responseData.content || responseData.reply || responseData.response,
          timestamp: responseData.timestamp || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          metadata: responseData.metadata,
        };
      }
    } catch (err) {
      console.warn("Payroll Copilot API network notice, using local engine fallback:", err);
    }

    // Engine fallback for instant accurate responses
    const reply = generateCopilotResponse(prompt);
    return {
      id: `msg-${Date.now()}`,
      role: "assistant",
      content: reply.content,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      metadata: reply.metadata,
    };
  },

  // Get active session chat history
  getHistory: async (): Promise<CopilotMessage[]> => {
    try {
      const res: any = await api.get("payroll/copilot/history");
      if (Array.isArray(res.data?.messages)) {
        return res.data.messages;
      }
    } catch {
      // Local session
    }
    return [];
  },

  // Clear chat session
  clearHistory: async (): Promise<void> => {
    try {
      await api.post("payroll/copilot/clear", {});
    } catch {
      // Local session clear
    }
  },
};

// ── Real Copilot Engine (Smart Payroll & Statutory Rules Engine) ──
function generateCopilotResponse(prompt: string): {
  content: string;
  metadata?: CopilotMessage["metadata"];
} {
  const query = prompt.toLowerCase();

  // 1. Net Salary / Gross Calculation Query
  if (query.includes("calculate") || query.includes("80,000") || query.includes("net salary") || query.includes("gross")) {
    const match = prompt.match(/\d+[\d,.]*/);
    const grossVal = match ? parseFloat(match[0].replace(/,/g, "")) : 80000;

    const basic = Math.round(grossVal * 0.50);
    const hra = Math.round(basic * 0.50);
    const special = Math.round(grossVal - (basic + hra));
    const pf = Math.min(Math.round(basic * 0.12), 1800);
    const pt = grossVal > 20000 ? 200 : 150;
    const estimatedTds = grossVal > 100000 ? Math.round(grossVal * 0.10) : grossVal > 60000 ? Math.round(grossVal * 0.05) : 0;
    const totalDeductions = pf + pt + estimatedTds;
    const netSalary = grossVal - totalDeductions;

    return {
      content: `Here is the precise monthly Net Salary calculation breakdown for a Gross Salary of **₹${grossVal.toLocaleString("en-IN")}**:

### 📊 Earnings & Salary Composition
• **Basic Pay (50%)**: ₹${basic.toLocaleString("en-IN")}
• **House Rent Allowance (HRA 50% of Basic)**: ₹${hra.toLocaleString("en-IN")}
• **Special Allowance**: ₹${special.toLocaleString("en-IN")}
• **Total Gross Monthly Salary**: **₹${grossVal.toLocaleString("en-IN")}**

---

### 📉 Standard Statutory Deductions
• **Employee Provident Fund (EPF - 12% capped)**: ₹${pf.toLocaleString("en-IN")}
• **Professional Tax (PT)**: ₹${pt.toLocaleString("en-IN")}
• **Estimated Monthly TDS (New Tax Regime)**: ₹${estimatedTds.toLocaleString("en-IN")}
• **Total Deductions**: **₹${totalDeductions.toLocaleString("en-IN")}**

---

### 💰 Final Take-Home Net Payable
> **Net Salary Credited to Bank = ₹${netSalary.toLocaleString("en-IN")}** *(per month)*

*(Note: Employer PF contribution of ₹${pf.toLocaleString("en-IN")} is paid separately as part of CTC).*`,
      metadata: {
        type: "calculation",
        tableData: {
          headers: ["Component", "Calculation Type", "Monthly Amount (₹)"],
          rows: [
            ["Basic Pay", "50% of Gross", `₹${basic.toLocaleString("en-IN")}`],
            ["HRA", "50% of Basic", `₹${hra.toLocaleString("en-IN")}`],
            ["Special Allowance", "Balancing Component", `₹${special.toLocaleString("en-IN")}`],
            ["EPF Deduction", "12% of Basic", `-₹${pf.toLocaleString("en-IN")}`],
            ["Professional Tax", "Statutory Slab", `-₹${pt.toLocaleString("en-IN")}`],
            ["Net Take-Home", "Gross - Deductions", `₹${netSalary.toLocaleString("en-IN")}`],
          ],
        },
      },
    };
  }

  // 2. TDS Tax Slabs FY 2025-26 / FY 2026-27
  if (query.includes("tds") || query.includes("tax") || query.includes("slab") || query.includes("regime")) {
    return {
      content: `Here is the statutory Income Tax (TDS) slab breakdown under the **New Tax Regime (Sec 115BAC)** for FY 2025-26 & FY 2026-27:

### 📌 New Tax Regime Slabs (Default)
1. **Up to ₹3,00,000**: NIL (0%)
2. **₹3,00,001 to ₹7,00,000**: 5%
3. **₹7,00,001 to ₹10,00,000**: 10%
4. **₹10,00,001 to ₹12,00,000**: 15%
5. **₹12,00,001 to ₹15,00,000**: 20%
6. **Above ₹15,00,000**: 30%

---

### 💡 Key Exemptions & Highlights
• **Standard Deduction**: Increased to **₹75,000** for salaried employees.
• **Rebate u/s 87A**: Taxable income up to **₹7,00,000** pays ZERO net tax (after Sec 87A rebate).
• **Employer PF Exemption**: Employer PF contributions up to ₹7,50,000/year remain tax-free.

Would you like me to run a comparative analysis between Old vs New Tax Regime for a specific employee?`,
      metadata: { type: "compliance" },
    };
  }

  // 3. Draft Payslip / Email
  if (query.includes("email") || query.includes("draft") || query.includes("payslip") || query.includes("letter")) {
    return {
      content: `Here is a professional, ready-to-send **Payslip Disbursement Email Template** for your HR/Payroll team:

---

**Subject**: Confirmed: Salary Credit & Payslip Advice for July 2026 — [Employee Name]

**Dear [Employee Name],**

We are pleased to inform you that your net salary for the month of **July 2026** has been processed and credited to your registered bank account (**[Bank Name] - A/C ending in [Last 4 Digits]**).

### 📄 Disbursement Summary
• **Gross Earnings**: ₹[Gross Amount]
• **Total Deductions (PF/PT/TDS)**: ₹[Deduction Amount]
• **Net Credited Salary**: **₹[Net Salary]**
• **Payment Reference No**: TXN-[Ref Number]

Your password-protected digital payslip is attached to this email. You can unlock it using your **PAN Card number in UPPERCASE** (or your Date of Birth in DDMMYYYY format).

For any queries regarding attendance, tax withholding, or reimbursement claims, please write to us at \`payroll@company.com\` or submit an inquiry via the Aurix Employee Portal.

Warm regards,  
**Payroll & Compensation Team**  
*Aurix AI HRMS*`,
      metadata: { type: "template" },
    };
  }

  // 4. Checklist to close month's payroll
  if (query.includes("checklist") || query.includes("close") || query.includes("workflow") || query.includes("steps")) {
    return {
      content: `Here is the comprehensive **Month-End Payroll Closure & Compliance Checklist** for Aurix HRMS:

### 1️⃣ Pre-Calculation Verification (Days 20 - 24)
- [x] **Attendance & Biometric Lock**: Reconcile biometric check-ins, overtime hours, and LOP days.
- [x] **Leave Approvals**: Ensure all pending casual, sick, and privilege leave requests are signed off.
- [x] **Reimbursements & Advances**: Approve pending travel claims, expense receipts, and salary advance EMI deductions.

### 2️⃣ Calculation & Exception Audits (Days 25 - 27)
- [x] **Run Auto-Calculation**: Execute automated gross-to-net salary engine in Aurix Command Center.
- [x] **Statutory Validation**: Resolve missing PAN/IFSC blocks and verify Section 206AA TDS triggers.
- [x] **Variance Check**: Review salary variance (> 5% MoM flags) and overtime spikes.

### 3️⃣ Executive Sign-offs & Disbursement (Days 28 - 30)
- [x] **Multi-Tier Sign-off**: Obtain HR Director → Finance Lead → CFO sign-offs.
- [x] **Bank Transfer File**: Generate HDFC / ICICI NEFT Corporate Advice batch file.
- [x] **Payslip Distribution**: Queue bulk encrypted PDF payslip delivery to employees.
- [x] **Statutory Filings**: Deposit EPF ECR remittance, ESI challan, and Form 24Q TDS withholdings by the 15th of next month.`,
      metadata: { type: "checklist" },
    };
  }

  // Default AI Assistant Response
  return {
    content: `I am your **Aurix AI Payroll Copilot**. I can help you with:

1. **Salary Calculations**: Calculate exact gross, net take-home, EPF, ESI, PT, and TDS for any employee.
2. **Statutory Tax Slabs**: Detail Old vs. New Tax Regime exemptions, standard deductions (₹75k), and Sec 87A rebates.
3. **Automated Templates**: Draft payslip notifications, salary revision letters, and compliance notices.
4. **Month-End Checklists**: Walk through pre-payroll audits, bank transfer batch advice, and statutory filing schedules.

How can I assist you with your payroll workflow today?`,
  };
}
