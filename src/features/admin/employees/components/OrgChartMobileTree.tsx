import React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { BackendHierarchyNode } from "@/store/employeeHierarchy/employeeHierarchyTypes";

export interface OrgChartMobileTreeProps {
  trees: BackendHierarchyNode[];
  expandedNodes: Record<string, boolean>;
  selectedEmployeeId: string | null;
  matchingNodeIds: Set<string>;
  onToggleExpand: (id: string, e: React.MouseEvent) => void;
  onSelectNode: (node: BackendHierarchyNode) => void;
}

interface MobileNodeProps {
  node: BackendHierarchyNode;
  depth: number;
  expandedNodes: Record<string, boolean>;
  selectedEmployeeId: string | null;
  matchingNodeIds: Set<string>;
  onToggleExpand: (id: string, e: React.MouseEvent) => void;
  onSelectNode: (node: BackendHierarchyNode) => void;
}

const MobileNode = React.memo(function MobileNode({
  node,
  depth,
  expandedNodes,
  selectedEmployeeId,
  matchingNodeIds,
  onToggleExpand,
  onSelectNode,
}: MobileNodeProps) {
  const isExpanded = expandedNodes[node.id] !== false;
  const isSelected = selectedEmployeeId === node.id;
  const isMatched = matchingNodeIds.has(node.id);
  const hasChildren = node.children && node.children.length > 0;
  const fullName = `${node.first_name} ${node.last_name}`.trim();

  const initials = fullName
    ? fullName
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "EX";

  return (
    <div className="space-y-2 text-left">
      <div
        onClick={() => onSelectNode(node)}
        className={`flex items-center justify-between gap-3 rounded-xl border p-3 bg-card/60 backdrop-blur-md transition-all ${
          isSelected
            ? "border-primary ring-2 ring-primary/30"
            : isMatched
            ? "border-brand-accent ring-2 ring-brand-accent/40"
            : "border-border/80 hover:bg-accent/60"
        }`}
        style={{ marginLeft: `${depth * 14}px` }}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {hasChildren ? (
            <button
              type="button"
              onClick={(e) => onToggleExpand(node.id, e)}
              className="grid h-6 w-6 shrink-0 place-items-center rounded-lg border border-border bg-accent/60 text-foreground"
            >
              {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
            </button>
          ) : (
            <span className="w-6 shrink-0" />
          )}

          {node.profile_photo_url ? (
            <img src={node.profile_photo_url} alt={fullName} className="h-8 w-8 rounded-lg object-cover shrink-0" />
          ) : (
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-brand text-xs font-bold text-brand-foreground">
              {initials}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-display text-sm font-semibold truncate">{fullName}</span>
              <span className="font-mono text-[10px] text-muted-foreground bg-accent px-1.5 py-0.5 rounded">
                {node.employee_id || "EMP"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground truncate">{node.designation} • {node.department}</p>
          </div>
        </div>

        {hasChildren && (
          <span className="shrink-0 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
            {node.children.length} reports
          </span>
        )}
      </div>

      {hasChildren && isExpanded && (
        <div className="space-y-2 border-l border-border/60 pl-2">
          {node.children.map((child) => (
            <MobileNode
              key={child.id}
              node={child}
              depth={depth + 1}
              expandedNodes={expandedNodes}
              selectedEmployeeId={selectedEmployeeId}
              matchingNodeIds={matchingNodeIds}
              onToggleExpand={onToggleExpand}
              onSelectNode={onSelectNode}
            />
          ))}
        </div>
      )}
    </div>
  );
});

export function OrgChartMobileTree({
  trees,
  expandedNodes,
  selectedEmployeeId,
  matchingNodeIds,
  onToggleExpand,
  onSelectNode,
}: OrgChartMobileTreeProps) {
  return (
    <div className="rounded-2xl border border-border bg-card/40 p-4 backdrop-blur-xl space-y-2">
      {trees.map((tree) => (
        <MobileNode
          key={tree.id}
          node={tree}
          depth={0}
          expandedNodes={expandedNodes}
          selectedEmployeeId={selectedEmployeeId}
          matchingNodeIds={matchingNodeIds}
          onToggleExpand={onToggleExpand}
          onSelectNode={onSelectNode}
        />
      ))}
    </div>
  );
}
