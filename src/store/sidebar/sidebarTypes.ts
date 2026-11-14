export type BadgeKind = "New" | "AI" | "Beta" | "Hot" | "Live";

export interface SidebarNavLeaf {
  title: string;
  href: string;
  icon?: any;
  badge?: BadgeKind;
  roles?: string[];
  permissions?: string[];
}

export interface SidebarNavParent {
  title: string;
  icon?: any;
  children: SidebarNavLeaf[];
  roles?: string[];
  permissions?: string[];
}

export type SidebarNavItem = SidebarNavLeaf | SidebarNavParent;

export interface SidebarNavSection {
  title: string;
  items: SidebarNavItem[];
  roles?: string[];
  permissions?: string[];
}

export interface SidebarState {
  userPermissions: string[];
  userRole: string | null;
  sidebarOpen: boolean;
  expandedSections: Record<string, boolean>;
  loading: boolean;
  error: string | null;
}
