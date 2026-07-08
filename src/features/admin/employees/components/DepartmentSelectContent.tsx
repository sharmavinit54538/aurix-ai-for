import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { SelectContent, SelectItem } from "@/components/ui/select";
import {
  DEPARTMENT_GROUPS,
  DEPARTMENT_VALUES,
  getDepartmentLabel,
  getExpandedGroupsForValue,
  isParentGroupValue,
  resolveDepartmentValue,
} from "../utils/departmentOptions";

interface DepartmentSelectContentProps {
  includeAllOption?: boolean;
  extraValues?: readonly string[];
  selectedValue?: string;
}

export function DepartmentSelectContent({
  includeAllOption = false,
  extraValues = [],
  selectedValue,
}: DepartmentSelectContentProps) {
  const resolvedSelectedValue = resolveDepartmentValue(selectedValue);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(() =>
    getExpandedGroupsForValue(selectedValue),
  );

  useEffect(() => {
    const groupsToExpand = getExpandedGroupsForValue(selectedValue);
    if (groupsToExpand.length === 0) return;

    setExpandedGroups((prev) => [...new Set([...prev, ...groupsToExpand])]);
  }, [selectedValue]);

  const toggleGroup = (value: string) => {
    setExpandedGroups((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  const customValues = extraValues
    .map((value) => resolveDepartmentValue(value) ?? value)
    .filter((value) => value && !DEPARTMENT_VALUES.includes(value));

  return (
    <SelectContent>
      {includeAllOption && <SelectItem value="all">All departments</SelectItem>}
      {resolvedSelectedValue && isParentGroupValue(resolvedSelectedValue) && (
        <SelectItem value={resolvedSelectedValue}>
          {getDepartmentLabel(resolvedSelectedValue)}
        </SelectItem>
      )}
      {customValues.map((value) => (
        <SelectItem key={value} value={value}>
          {value}
        </SelectItem>
      ))}
      {DEPARTMENT_GROUPS.map((group) => {
        const hasChildren =
          (group.subgroups?.length ?? 0) > 0 || (group.options?.length ?? 0) > 0;
        const isExpanded =
          expandedGroups.includes(group.value) ||
          group.options?.includes(resolvedSelectedValue ?? "") ||
          group.subgroups?.some(
            (subgroup) =>
              subgroup.value === resolvedSelectedValue ||
              subgroup.options.includes(resolvedSelectedValue ?? ""),
          );

        if (!hasChildren) {
          return (
            <SelectItem key={group.value} value={group.value} className="font-medium">
              {group.label}
            </SelectItem>
          );
        }

        return (
          <div key={group.value}>
            <div
              className="flex cursor-pointer items-center justify-between px-2 py-2 text-sm font-medium"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleGroup(group.value);
              }}
            >
              <span>{group.label}</span>
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </div>
            {isExpanded && (
              <>
                {group.subgroups?.map((subgroup) =>
                  subgroup.options?.length ? (
                    <div key={subgroup.value}>
                      <div className="px-4 py-1.5 text-xs font-medium text-muted-foreground">
                        {subgroup.label}
                      </div>
                      {subgroup.options.map((option) => (
                        <SelectItem key={option} value={option} className="pl-6">
                          {option}
                        </SelectItem>
                      ))}
                    </div>
                  ) : (
                    <SelectItem key={subgroup.value} value={subgroup.value} className="pl-6">
                      {subgroup.label}
                    </SelectItem>
                  ),
                )}
                {group.options?.map((option) => (
                  <SelectItem key={option} value={option} className="pl-6">
                    {option}
                  </SelectItem>
                ))}
              </>
            )}
          </div>
        );
      })}
    </SelectContent>
  );
}
