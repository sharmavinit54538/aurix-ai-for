import type { ComponentType } from "react";

export type BadgeKind = "New" | "AI" | "Beta" | "Hot";

export interface SidebarNavLeaf {
  id?: string;
  to: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  exact?: boolean;
  roles?: string[];
  permission?: string;
  badge?: BadgeKind;
  count?: number;
}

export interface SidebarNavParent {
  id: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  basePath: string;
  children: SidebarNavLeaf[];
  roles?: string[];
  permission?: string;
  badge?: BadgeKind;
  count?: number;
}

export type SidebarNavItem = SidebarNavLeaf | SidebarNavParent;

export interface SidebarNavSection {
  id?: string;
  title?: string;
  items: SidebarNavItem[];
  roles?: string[];
}

export interface SidebarState {
  expandedSections: Record<string, boolean>;
  selectedMenu: string | null;
  activeRoute: string;
  userPermissions: string[];
  permissionsLoading: boolean;
  permissionsError: string | null;
  userRole: string | null;
}

export interface SidebarPermissionsResponse {
  role?: string;
  permissions: string[];
}
