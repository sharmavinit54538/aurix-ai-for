export type DepartmentSubgroup = {
  value: string;
  label: string;
  options: readonly string[];
};

export type DepartmentGroup = {
  value: string;
  label: string;
  subgroups?: readonly DepartmentSubgroup[];
  options?: readonly string[];
};

export const DEPARTMENT_GROUPS: readonly DepartmentGroup[] = [
  {
    value: "Management",
    label: "Management",
  },
  {
    value: "Engineering",
    label: "Engineering",
    options: ["Developer", "Tester", "Designer"],
  },
  {
    value: "Sales&Marketing",
    label: "Sales & Marketing",
  },
  {
    value: "Core",
    label: "Core",
    options: ["CEO", "CTO", "Director", "CPO", "CMO"],
  },
];

export const DEPARTMENT_VALUES = DEPARTMENT_GROUPS.flatMap((group) => [
  group.value,
  ...(group.subgroups?.flatMap((sub) => [sub.value, ...sub.options]) ?? []),
  ...(group.options ?? []),
]);

export function resolveDepartmentValue(value?: string): string | undefined {
  if (!value) return undefined;

  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (DEPARTMENT_VALUES.includes(trimmed)) return trimmed;

  for (const group of DEPARTMENT_GROUPS) {
    if (group.label === trimmed) return group.value;

    for (const subgroup of group.subgroups ?? []) {
      if (subgroup.label === trimmed || subgroup.value === trimmed) return subgroup.value;
    }
  }

  return trimmed;
}

export function getExpandedGroupsForValue(value?: string): string[] {
  const resolved = resolveDepartmentValue(value);
  if (!resolved) return [];

  for (const group of DEPARTMENT_GROUPS) {
    if (group.value === resolved) return [];

    if (group.options?.includes(resolved)) return [group.value];

    for (const subgroup of group.subgroups ?? []) {
      if (subgroup.value === resolved || subgroup.options.includes(resolved)) {
        return [group.value];
      }
    }
  }

  return [];
}

export function getDepartmentLabel(value: string): string {
  for (const group of DEPARTMENT_GROUPS) {
    if (group.value === value) return group.label;

    for (const subgroup of group.subgroups ?? []) {
      if (subgroup.value === value) return subgroup.label;
      if (subgroup.options.includes(value)) return value;
    }

    if (group.options?.includes(value)) return value;
  }

  return value;
}

export function isParentGroupValue(value: string): boolean {
  const group = DEPARTMENT_GROUPS.find((item) => item.value === value);
  return Boolean(group && ((group.options?.length ?? 0) > 0 || (group.subgroups?.length ?? 0) > 0));
}
