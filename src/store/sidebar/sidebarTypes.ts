export type BadgeKind = "New" | "AI" | "Beta" | "Hot" | "Live";

export interface SidebarNavLeaf {
  title?: string;
  label?: string;
  href?: string;
  to?: string;
  icon?: any;
  badge?: BadgeKind;
  roles?: string[];
  permissions?: string[];
  permission?: string;
  exact?: boolean;
  matchPrefixes?: string[];
  basePath?: string;
  count?: number;
  id?: string;
}

export interface SidebarNavParent {
  title?: string;
  label?: string;
  icon?: any;
  children: SidebarNavLeaf[];
  roles?: string[];
  permissions?: string[];
  permission?: string;
  basePath?: string;
  badge?: BadgeKind;
  count?: number;
  id?: string;
}

export type SidebarNavItem = SidebarNavLeaf | SidebarNavParent;

export interface SidebarNavSection {
  title?: string;
  items: SidebarNavItem[];
  roles?: string[];
  permissions?: string[];
  id?: string;
}

export interface SidebarState {
  userPermissions: string[];
  userRole: string | null;
  sidebarOpen: boolean;
  expandedSections: Record<string, boolean>;
  loading: boolean;
  error: string | null;
}
