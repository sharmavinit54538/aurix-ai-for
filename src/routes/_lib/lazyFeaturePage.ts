import { lazy, type ComponentType, type LazyExoticComponent } from "react";

/**
 * Lazy-load a page from `src/features/.../pages/`.
 * Use named export: lazyFeaturePage(() => import("..."), "PageName")
 * Use default export: lazyFeaturePage(() => import("..."))
 */
export function lazyFeaturePage(
  loader: () => Promise<{ default: ComponentType }>,
): LazyExoticComponent<ComponentType>;
export function lazyFeaturePage(
  loader: () => Promise<Record<string, ComponentType>>,
  exportName: string,
): LazyExoticComponent<ComponentType>;
export function lazyFeaturePage(
  loader: () => Promise<Record<string, ComponentType> | { default: ComponentType }>,
  exportName?: string,
): LazyExoticComponent<ComponentType> {
  return lazy(async () => {
    const module = await loader();
    if (exportName) {
      const component = (module as Record<string, ComponentType>)[exportName];
      if (!component) {
        throw new Error(`Export "${exportName}" not found in feature page module`);
      }
      return { default: component };
    }
    if ("default" in module && module.default) {
      return { default: module.default };
    }
    throw new Error("Feature page must use default export or pass exportName to lazyFeaturePage");
  });
}
