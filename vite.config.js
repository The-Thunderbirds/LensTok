import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import babel from "vite-plugin-babel";

import { viteCommonjs, esbuildCommonjs } from '@originjs/vite-plugin-commonjs';

import GlobalPolyFill from "@esbuild-plugins/node-globals-polyfill";

export default defineConfig({
    plugins: [react(), babel(), viteCommonjs(),],
    optimizeDeps: {
        esbuildOptions: {
            define: {
                global: "globalThis",
            },
            plugins: [
                GlobalPolyFill({
                    process: true,
                    buffer: true,
                }),                
            ],
        },
    },
    resolve: {
        alias: {
            process: "process/browser",
            stream: "stream-browserify",
            zlib: "browserify-zlib",
            util: "util",
        },
    },
});
