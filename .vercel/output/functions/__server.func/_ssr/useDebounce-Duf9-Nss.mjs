import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/useDebounce-Duf9-Nss.js
var import_react = /* @__PURE__ */ __toESM(require_react());
/**
* Standardized, high-performance debounce hook for search queries and filter inputs.
* Delays updating the debounced value until after the specified delay has elapsed
* since the last time the value was modified.
*/
function useDebounce(value, delayMs = 300) {
	const [debouncedValue, setDebouncedValue] = (0, import_react.useState)(value);
	(0, import_react.useEffect)(() => {
		const timer = setTimeout(() => {
			setDebouncedValue(value);
		}, delayMs);
		return () => {
			clearTimeout(timer);
		};
	}, [value, delayMs]);
	return debouncedValue;
}
//#endregion
export { useDebounce as t };
