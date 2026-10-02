import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as safeStorage } from "./safe-storage-DInQCreU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ThemeProvider-2CHrEfXV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ThemeContext = (0, import_react.createContext)({
	theme: "dark",
	toggle: () => {}
});
function ThemeProvider({ children }) {
	const [theme, setTheme] = (0, import_react.useState)("dark");
	(0, import_react.useEffect)(() => {
		setTheme(safeStorage.getItem("theme") ?? "dark");
	}, []);
	(0, import_react.useEffect)(() => {
		document.documentElement.classList.toggle("dark", theme === "dark");
		safeStorage.setItem("theme", theme);
	}, [theme]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeContext.Provider, {
		value: {
			theme,
			toggle: () => setTheme((t) => t === "dark" ? "light" : "dark")
		},
		children
	});
}
var useTheme = () => (0, import_react.useContext)(ThemeContext);
//#endregion
export { useTheme as n, ThemeProvider as t };
