import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/lazyFeaturePage-d1-V9bi8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function lazyFeaturePage(loader, exportName) {
	return (0, import_react.lazy)(async () => {
		const module = await loader();
		if (exportName) {
			const component = module[exportName];
			if (!component) throw new Error(`Export "${exportName}" not found in feature page module`);
			return { default: component };
		}
		if ("default" in module && module.default) return { default: module.default };
		throw new Error("Feature page must use default export or pass exportName to lazyFeaturePage");
	});
}
//#endregion
export { lazyFeaturePage as t };
