import os
import json
import re

openapi_path = "openapi.json"
openapi = json.load(open(openapi_path, encoding="utf-8")) if os.path.exists(openapi_path) else {}
openapi_paths = set(openapi.get("paths", {}).keys())

payroll_pages = [
    "src/pages/PayrollDashboardPage.tsx",
    "src/pages/PayrollPeriodsPage.tsx",
    "src/pages/PayrollProcessingPage.tsx",
    "src/pages/PayrollValidationPage.tsx",
    "src/pages/PayrollPreviewPage.tsx",
    "src/pages/PayrollApprovalPage.tsx",
    "src/pages/PayrollFinalizationPage.tsx",
    "src/pages/PayrollPayslipsHubPage.tsx",
    "src/pages/PayrollPayslipPage.tsx",
    "src/pages/EmployeePayrollDetailPage.tsx",
    "src/features/payroll/pages/EmployeeCompensationPage.tsx",
    "src/features/payroll/pages/EmployeeSelfServicePayrollPage.tsx",
    "src/features/payroll/pages/FullAndFinalPage.tsx",
    "src/features/payroll/pages/PaymentBatchDetailPage.tsx",
    "src/features/payroll/pages/PaymentBatchListPage.tsx",
    "src/features/payroll/pages/PayrollReportsPage.tsx",
    "src/features/payroll/pages/PayrollRunPaymentPage.tsx",
    "src/features/payroll/pages/SalaryStructurePage.tsx",
    "src/features/payroll/pages/StatutoryCompliancePage.tsx",
    "src/features/payroll/pages/VariableInputsPage.tsx",
    "src/features/settings/components/sections/PayrollSection.tsx",
    "src/features/autopilot/components/AutoPayrollPanel.tsx",
    "src/features/employee-onboarding/components/steps/TaxPayrollStep.tsx",
]

print("| Page | API Calls Used | Loading State | Error State | Empty State | Dummy Literals |")
print("|---|---|---|---|---|---|")

for p in payroll_pages:
    name = os.path.basename(p)
    if not os.path.exists(p):
        print(f"| {name} | NOT FOUND | - | - | - | - |")
        continue
    with open(p, encoding="utf-8") as f:
        content = f.read()

    api_calls = re.findall(
        r"(?:payrollApi|paymentApi|essApi|fnfApi|compensationApi|statutoryApi|variableInputsApi|payrollSettingsApi)\.(\w+)",
        content,
    )
    calls_set = sorted(set(api_calls))
    calls_display = ", ".join(calls_set[:4]) + ("..." if len(calls_set) > 4 else "")

    has_loading = "Yes" if any(w in content.lower() for w in ["isloading", "skeleton", "spinner"]) else "NO"
    has_error = "Yes" if any(w in content.lower() for w in ["iserror", "error", "failed"]) else "NO"
    has_empty = "Yes" if any(w in content.lower() for w in ["empty", "length === 0", "not available", "no records"]) else "NO"

    dummies = []
    if "1234567890" in content:
        dummies.append("1234567890")
    if "ABCDE1234F" in content:
        dummies.append("ABCDE1234F")
    if "HDFC0001234" in content or "ICIC0001234" in content:
        dummies.append("sample IFSC")
    if "John Doe" in content or "Jane Doe" in content:
        dummies.append("John/Jane")
    if "Acme" in content:
        dummies.append("Acme")
    if "Demo Company" in content or "Demo Corp" in content:
        dummies.append("Demo Corp")

    dummy_str = ", ".join(dummies) if dummies else "None"
    print(f"| {name} | {calls_display or 'None'} | {has_loading} | {has_error} | {has_empty} | {dummy_str} |")
