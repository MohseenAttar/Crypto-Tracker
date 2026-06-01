import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: "https://api.coingecko.com/api/v3",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
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
