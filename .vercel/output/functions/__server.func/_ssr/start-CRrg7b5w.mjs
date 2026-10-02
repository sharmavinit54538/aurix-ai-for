import { t as renderErrorPage } from "./ssr.mjs";
import { n as createStart, r as createMiddleware } from "./tanstack-vendor-DnMKDTDc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/start-CRrg7b5w.js
var errorMiddleware = createMiddleware().server(async ({ next }) => {
	try {
		return await next();
	} catch (error) {
		if (error != null && typeof error === "object" && "statusCode" in error) throw error;
		console.error(error);
		return new Response(renderErrorPage(), {
			status: 500,
			headers: { "content-type": "text/html; charset=utf-8" }
		});
	}
});
var startInstance = createStart(() => ({ requestMiddleware: [errorMiddleware] }));
//#endregion
export { startInstance };
