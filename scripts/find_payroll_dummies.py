import os
import re

dirs = [
    "src/pages",
    "src/features/payroll",
    "src/features/settings/components/sections",
    "src/features/autopilot",
    "src/features/employee-onboarding",
    "src/services/payrollApi.ts",
]

patterns = [
    ("1234567890", r"1234567890"),
    ("ABCDE1234F", r"ABCDE1234F"),
    ("sample IFSC", r"HDFC0001234|ICIC0001234|SBIN0001234"),
    ("John/Jane Doe", r'"John Doe"|"Jane Doe"'),
    ("Demo/Sample", r'"Demo"|"Sample"|"Demo Corp"|"Acme"'),
]

for d in dirs:
    if os.path.isfile(d):
        files_to_check = [d]
    else:
        files_to_check = []
        for root, _, files in os.walk(d):
            for file in files:
                if file.endswith(".ts") or file.endswith(".tsx"):
                    files_to_check.append(os.path.join(root, file))

    for filepath in files_to_check:
        with open(filepath, encoding="utf-8") as f:
            content = f.read()
        for name, pat in patterns:
            found = re.findall(pat, content)
            if found:
                print(f"{filepath}: found {name} -> {found[:3]}")
