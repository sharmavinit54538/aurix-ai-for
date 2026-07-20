import React, { useState, useMemo } from "react";
import type { Department, HierarchyNode } from "../types";
import { ChevronDown, ChevronRight, Users, User, ArrowRight, Building } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DepartmentHierarchyProps {
  departments: Department[];
  onView: (dept: Department) => void;
}

export function DepartmentHierarchy({ departments, onView }: DepartmentHierarchyProps) {
  // Build hierarchy tree structure
  const treeData = useMemo(() => {
    const map: Record<string, HierarchyNode & { childrenCount: number }> = {};
    const roots: HierarchyNode[] = [];

    // Initialize map
    departments.forEach((d) => {
      map[d.id] = {
        id: d.id,
        name: d.name,
        department_code: d.department_code,
        headName: d.departmentHeadName,
        themeColor: d.themeColor,
        iconName: d.iconName,
        children: [],
        childrenCount: d.currentEmployeeCount,
      };
    });

    // Populate children
    departments.forEach((d) => {
      const node = map[d.id];
      if (d.parentId && map[d.parentId]) {
        map[d.parentId].children.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  }, [departments]);

  return (
    <div className="rounded-2xl border border-border/60 bg-card/40 p-6 shadow-sm space-y-4">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
          <Building className="h-4 w-4 text-brand" /> Corporate Reporting Structure
        </h3>
        <p className="text-xs text-muted-foreground">
          Explore reporting branches from main root business divisions down to agile functional teams.
        </p>
      </div>

      <div className="border border-border/40 rounded-xl bg-background/20 p-5 overflow-x-auto min-h-[300px]">
        {treeData.length > 0 ? (
          <div className="space-y-4 min-w-[500px]">
            {treeData.map((node) => (
              <TreeNode key={node.id} node={node} departments={departments} onView={onView} depth={0} />
            ))}
          </div>
        ) : (
          <div className="text-xs text-muted-foreground italic text-center py-12">
            No department tree matches. Create a department structure to display hierarchy.
          </div>
        )}
      </div>
    </div>
  );
}

interface TreeNodeProps {
  node: HierarchyNode;
  departments: Department[];
  onView: (dept: Department) => void;
  depth: number;
}

function TreeNode({ node, departments, onView, depth }: TreeNodeProps) {
  const [expanded, setExpanded] = useState(true);

  // Retrieve exact department details from original list
  const dept = departments.find((d) => d.id === node.id);
  const IconComponent = (LucideIcons as any)[node.iconName] || LucideIcons.Building2;

  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="space-y-2 select-none">
      {/* Node Row card */}
      <div className="flex items-center gap-2 relative">
        {/* Branch Lines Indentation Connector */}
        {depth > 0 && (
          <div
            className="absolute border-l border-b border-border/80 rounded-bl-lg"
            style={{
              left: `${(depth - 1) * 32 + 12}px`,
              width: "20px",
              height: "22px",
              top: "-10px",
            }}
          />
        )}

        <div
          className="flex items-center gap-3 p-3 rounded-xl border border-border/80 bg-card hover:bg-muted/10 hover:border-brand/40 shadow-sm transition-all duration-300 w-full max-w-lg cursor-pointer"
          style={{ marginLeft: `${depth * 32}px` }}
          onClick={() => dept && onView(dept)}
        >
          {/* Collapse/Expand Toggle */}
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
              className="h-5 w-5 rounded hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer flex-shrink-0"
            >
              {expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
            </button>
          ) : (
            <div className="w-5 flex-shrink-0" />
          )}

          {/* Node Icon */}
          <div
            className="h-8 w-8 rounded-lg flex items-center justify-center text-white flex-shrink-0"
            style={{ backgroundColor: node.themeColor }}
          >
            <IconComponent className="h-4 w-4" />
          </div>

          {/* Node details */}
          <div className="flex-1 min-w-0 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-bold text-foreground truncate">{node.name}</p>
              <p className="text-[10px] text-muted-foreground truncate flex items-center gap-1">
                <User className="h-3 w-3" /> {node.headName || "Unassigned"}
              </p>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <Badge variant="secondary" className="text-[9px] font-semibold tracking-wider font-mono">
                {node?.department_code}
              </Badge>
              {dept && (
                <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                  <Users className="h-3 w-3" /> {dept.currentEmployeeCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Render children branches recursively */}
      {expanded && hasChildren && (
        <div className="relative">
          {/* Vertical flow connector line */}
          <div
            className="absolute border-l border-border/80"
            style={{
              left: `${depth * 32 + 12}px`,
              top: "-4px",
              bottom: "16px",
            }}
          />
          <div className="space-y-2">
            {node.children.map((child) => (
              <TreeNode key={child.id} node={child} departments={departments} onView={onView} depth={depth + 1} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
