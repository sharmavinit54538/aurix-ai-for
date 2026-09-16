import { defineConfig, loadEnv } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig(({ mode, isSsrBuild }) => {
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
          secure: false,
        },
        "/api": {
          target: targetApi,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    resolve: {
      tsconfigPaths: true,
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      target: "esnext",
      cssCodeSplit: true,
      chunkSizeWarningLimit: 1200,
      rollupOptions: !isSsrBuild
        ? {
            output: {
              manualChunks(id: string) {
                if (id.includes("node_modules")) {
                  if (
                    id.includes("react/") ||
                    id.includes("react-dom") ||
                    id.includes("react-redux") ||
                    id.includes("@reduxjs")
                  ) {
                    return "react-vendor";
                  }
                  if (id.includes("@tanstack")) {
                    return "tanstack-vendor";
                  }
                  if (id.includes("recharts")) {
                    return "charts-vendor";
                  }
                  if (id.includes("framer-motion")) {
                    return "motion-vendor";
                  }
                  if (id.includes("lucide-react")) {
                    return "icons-vendor";
                  }
                  if (id.includes("@radix-ui")) {
                    return "ui-vendor";
                  }
                }
              },
            },
          }
        : undefined,
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
