import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: "https://api.coingecko.com",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, "/api/v3"),
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq) => {
              if (env.VITE_COINGECKO_KEY) {
                proxyReq.setHeader("x-cg-demo-api-key", env.VITE_COINGECKO_KEY);
              }
            });
          },
        },
      },
    },
  };
});