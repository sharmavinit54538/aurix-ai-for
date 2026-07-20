import React, { useMemo } from "react";
import type { BackendHierarchyNode } from "@/store/employeeHierarchy/employeeHierarchyTypes";
import { OrgChartNodeCard } from "./OrgChartNodeCard";

export interface OrgChartCanvasProps {
  trees: BackendHierarchyNode[];
  expandedNodes: Record<string, boolean>;
  selectedEmployeeId: string | null;
  matchingNodeIds: Set<string>;
  zoomLevel: number;
  onToggleExpand: (id: string, e: React.MouseEvent) => void;
  onSelectNode: (node: BackendHierarchyNode) => void;
}

interface TreeNodeProps {
  node: BackendHierarchyNode;
  expandedNodes: Record<string, boolean>;
  selectedEmployeeId: string | null;
  matchingNodeIds: Set<string>;
  onToggleExpand: (id: string, e: React.MouseEvent) => void;
  onSelectNode: (node: BackendHierarchyNode) => void;
}

const TreeNode = React.memo(function TreeNode({
  node,
  expandedNodes,
  selectedEmployeeId,
  matchingNodeIds,
  onToggleExpand,
  onSelectNode,
}: TreeNodeProps) {
  const isExpanded = expandedNodes[node.id] !== false;
  const isSelected = selectedEmployeeId === node.id;
  const isMatched = matchingNodeIds.has(node.id);
  const hasChildren = node.children && node.children.length > 0 && isExpanded;

  return (
    <div className="flex flex-col items-center">
      {/* Node Card */}
      <OrgChartNodeCard
        node={node}
        isExpanded={isExpanded}
        isSelected={isSelected}
        isMatched={isMatched}
        onToggleExpand={onToggleExpand}
        onSelect={onSelectNode}
      />

      {/* Children Tree Connector */}
      {hasChildren && (
        <div className="flex flex-col items-center w-full">
          {/* Vertical Connecting Line down from parent node */}
          <div className="h-6 w-0.5 bg-border/80" />

          {/* Children Row Container */}
          <div className="relative flex justify-center gap-8 pt-2">
            {/* Horizontal Top Connecting Line for multiple siblings */}
            {node.children.length > 1 && (
              <div
                className="absolute top-0 h-0.5 bg-border/80"
                style={{
                  left: "calc(140px + 16px)",
                  right: "calc(140px + 16px)",
                }}
              />
            )}

            {/* Child Node Wrappers */}
            {node.children.map((child) => (
              <div key={child.id} className="relative flex flex-col items-center">
                {/* Vertical Stem Line from horizontal bar down to child node */}
                <div className="h-4 w-0.5 bg-border/80 -mt-2 mb-2" />
                <TreeNode
                  node={child}
                  expandedNodes={expandedNodes}
                  selectedEmployeeId={selectedEmployeeId}
                  matchingNodeIds={matchingNodeIds}
                  onToggleExpand={onToggleExpand}
                  onSelectNode={onSelectNode}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

export function OrgChartCanvas({
  trees,
  expandedNodes,
  selectedEmployeeId,
  matchingNodeIds,
  zoomLevel,
  onToggleExpand,
  onSelectNode,
}: OrgChartCanvasProps) {
  const scale = useMemo(() => zoomLevel / 100, [zoomLevel]);

  return (
    <div className="relative w-full overflow-auto rounded-2xl border border-border bg-card/40 p-8 backdrop-blur-xl min-h-[600px] flex justify-center">
      <div
        className="transition-transform duration-300 origin-top flex justify-center gap-16 py-6"
        style={{
          transform: `scale(${scale})`,
          minWidth: "100%",
        }}
      >
        {trees.map((tree) => (
          <TreeNode
            key={tree.id}
            node={tree}
            expandedNodes={expandedNodes}
            selectedEmployeeId={selectedEmployeeId}
            matchingNodeIds={matchingNodeIds}
            onToggleExpand={onToggleExpand}
            onSelectNode={onSelectNode}
          />
        ))}
      </div>
    </div>
  );
}
