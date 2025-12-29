import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

const pageName = "stall_diagnostic";
const baseDir = "C:\\DBAnalit\\Feature";
const staticDir = path.join(baseDir, "static");
const templatesDir = path.join(baseDir, "templates");

// Рекурсивное копирование
const copyRecursiveSync = (src: string, dest: string) => {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const file of fs.readdirSync(src)) {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    const stat = fs.statSync(srcPath);
    if (stat.isDirectory()) {
      copyRecursiveSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
};

export default defineConfig({
  base: "/static/",
  plugins: [
    react(),
    {
      name: "move-files-after-build",
      closeBundle() {
        const distDir = path.resolve(__dirname, "dist");

        // --- копируем HTML ---
        const htmlSrc = path.join(distDir, "index.html");
        const htmlDest = path.join(templatesDir, `${pageName}.html`);
        if (fs.existsSync(htmlSrc)) {
          fs.copyFileSync(htmlSrc, htmlDest);
          console.log(`✅ HTML перенесён → ${htmlDest}`);
        }

        // --- копируем весь JS ---
        const jsSrc = path.join(distDir, "js");
        const jsDest = path.join(staticDir, "js");
        copyRecursiveSync(jsSrc, jsDest);
        console.log(`✅ JS перенесён → ${jsDest}`);

        // --- копируем весь CSS ---
        const cssSrc = path.join(distDir, "css");
        const cssDest = path.join(staticDir, "css");
        copyRecursiveSync(cssSrc, cssDest);
        console.log(`✅ CSS перенесён → ${cssDest}`);
      },
    },
  ],
  build: {
    outDir: "dist",
    emptyOutDir: false,
    rollupOptions: {
      input: "./index.html",
      output: {
        entryFileNames: `js/pages/${pageName}.js`,
        chunkFileNames: `js/pages/${pageName}-[hash].js`,
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith(".css")) {
            return `css/pages/${pageName}.css`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
    },
  },
  server: {
    host: "10.90.25.125",
    port: 3002,
    proxy: {
      "/api": {
        target: "http://10.90.25.125:5000",
        changeOrigin: true,
      },
    },
  },
});
