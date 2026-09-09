import { defineConfig, loadEnv } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  let targetApi = (env.VITE_API_URL || "https://api.ofc360.com").trim().replace(/\/$/, "");
  if (!targetApi.startsWith("http://") && !targetApi.startsWith("https://")) {
    targetApi = `https://${targetApi}`;
  }
  targetApi = targetApi.replace(/www\.api\.ofc360\.com/g, "api.ofc360.com");

  return {
    server: {
      port: 8080,
      proxy: {
        "/uploads": {
          target: targetApi,
          changeOrigin: true,
        },
        "/api": {
          target: targetApi,
          changeOrigin: true,
        },
      },
    },
  resolve: {
    tsconfigPaths: true,
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
    plugins: [
      tailwindcss(),
      tanstackStart({
        server: { entry: "server" },
      }),
      viteReact(),
    ],
  };
});
