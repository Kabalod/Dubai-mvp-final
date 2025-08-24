import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import { lingui } from "@lingui/vite-plugin";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");
    const frontendApi = env.VITE_FRONTEND_API_URL || env.FRONTEND_API_URL || "/api";
    return {
        plugins: [
            lingui(),
            react({
                babel: {
                    plugins: ["macros"],
                },
            }),
        ],
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "src"),
            },
        },
        css: {
            postcss: {
                plugins: [
                    require('@tailwindcss/postcss'),
                    require('autoprefixer'),
                ]
            },
            preprocessorOptions: {
                scss: {
                    additionalData: `@use "@/styles/global.scss" as *;`,
                },
            },
        },
        define: {
            "import.meta.env.VITE_FRONTEND_API_URL": JSON.stringify(frontendApi),
        },
        server: {
            port: 3000,
            host: true,
        },
        preview: {
            port: 3000,
            host: true,
        },
    };
});
