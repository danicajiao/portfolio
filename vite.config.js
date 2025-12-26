// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
    root: 'src',
    publicDir: '../public',
    base: process.env.GITHUB_ACTIONS ? '/portfolio/' : '/',
    server: {
        port: 5173,
        open: false, // Change this to false to prevent opening the browser automatically
    },
    build: {
        outDir: '../dist',
        assetsDir: 'assets',
        emptyOutDir: true,
        sourcemap: true
    }
});
