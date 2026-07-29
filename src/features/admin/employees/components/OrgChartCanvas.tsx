import React, { useMemo, useState, useRef } from "react";
import type {
  BackendHierarchyNode,
  HierarchyLayoutType,
  ConnectorStyleType,
} from "@/store/employeeHierarchy/employeeHierarchyTypes";
import { OrgChartNodeCard } from "./OrgChartNodeCard";

export interface OrgChartCanvasProps {
  trees: BackendHierarchyNode[];
  expandedNodes: Record<string, boolean>;
  selectedEmployeeId: string | null;
  matchingNodeIds: Set<string>;
  zoomLevel: number;
  layout: HierarchyLayoutType;
  connectorStyle: ConnectorStyleType;
  onToggleExpand: (id: string, e: React.MouseEvent) => void;
  onSelectNode: (node: BackendHierarchyNode) => void;
}

interface TreeNodeProps {
  node: BackendHierarchyNode;
  expandedNodes: Record<string, boolean>;
  selectedEmployeeId: string | null;
  matchingNodeIds: Set<string>;
  layout: HierarchyLayoutType;
  connectorStyle: ConnectorStyleType;
  onToggleExpand: (id: string, e: React.MouseEvent) => void;
  onSelectNode: (node: BackendHierarchyNode) => void;
}

const TreeNode = React.memo(function TreeNode({
  node,
  expandedNodes,
  selectedEmployeeId,
  matchingNodeIds,
  layout,
  connectorStyle,
  onToggleExpand,
  onSelectNode,
}: TreeNodeProps) {
  const isExpanded = expandedNodes[node.id] !== false;
  const isSelected = selectedEmployeeId === node.id;
  const isMatched = matchingNodeIds.has(node.id);
  const hasChildren = node.children && node.children.length > 0 && isExpanded;

  const isHorizontal = layout === "horizontal";

  return (
    <div className={`flex ${isHorizontal ? "flex-row items-center" : "flex-col items-center"}`}>
      {/* Node Card */}
      <OrgChartNodeCard
        node={node}
        isExpanded={isExpanded}
        isSelected={isSelected}
        isMatched={isMatched}
        onToggleExpand={onToggleExpand}
        onSelect={onSelectNode}
        layout={layout}
      />

      {/* Children Tree Connector */}
      {hasChildren && (
        <div className={`flex ${isHorizontal ? "flex-row items-center" : "flex-col items-center"} w-full`}>
          {/* Stem Connecting Line from parent node */}
          <div className={isHorizontal ? "w-8 h-0.5 bg-border/80" : "h-6 w-0.5 bg-border/80"} />

          {/* Children Row/Column Container */}
          <div className={`relative flex ${isHorizontal ? "flex-col justify-center gap-6 pl-2" : "justify-center gap-8 pt-2"}`}>
            {/* Horizontal/Vertical Bar for multiple siblings */}
            {node.children.length > 1 && (
              <div
                className={`absolute bg-border/80 ${
                  isHorizontal
                    ? "left-0 w-0.5 top-[calc(50px)] bottom-[calc(50px)]"
                    : "top-0 h-0.5 left-[calc(140px+16px)] right-[calc(140px+16px)]"
                }`}
              />
            )}

            {/* Child Node Wrappers */}
            {node.children.map((child) => (
              <div
                key={child.id}
                className={`relative flex ${isHorizontal ? "flex-row items-center" : "flex-col items-center"}`}
              >
                {/* Branch Stem Line from bar down to child node */}
                <div
                  className={`bg-border/80 ${
                    isHorizontal ? "w-4 h-0.5 -ml-2 mr-2" : "h-4 w-0.5 -mt-2 mb-2"
                  }`}
                />
                <TreeNode
                  node={child}
                  expandedNodes={expandedNodes}
                  selectedEmployeeId={selectedEmployeeId}
                  matchingNodeIds={matchingNodeIds}
                  layout={layout}
                  connectorStyle={connectorStyle}
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
  layout,
  connectorStyle,
  onToggleExpand,
  onSelectNode,
}: OrgChartCanvasProps) {
  const scale = useMemo(() => zoomLevel / 100, [zoomLevel]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only primary mouse click
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={`relative w-full overflow-hidden rounded-2xl border border-border bg-card/40 backdrop-blur-xl min-h-[650px] flex justify-center items-center ${
        isDragging ? "cursor-grabbing select-none" : "cursor-grab"
      }`}
    >
      {/* Background Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-40" />

      {/* Canvas Inner Transform Wrapper */}
      <div
        className="transition-transform duration-200 origin-center flex justify-center gap-16 py-12 px-12"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
        }}
      >
        {trees.map((tree) => (
          <TreeNode
            key={tree.id}
            node={tree}
            expandedNodes={expandedNodes}
            selectedEmployeeId={selectedEmployeeId}
            matchingNodeIds={matchingNodeIds}
            layout={layout}
            connectorStyle={connectorStyle}
            onToggleExpand={onToggleExpand}
            onSelectNode={onSelectNode}
          />
        ))}
      </div>
    </div>
  );
}
