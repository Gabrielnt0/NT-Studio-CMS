import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";

export default defineConfig({
  base: isGitHubPages ? "/portfolio-CMS/" : "/",
  plugins: [react(), tailwindcss()],

  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: "vendor-react",
              test: /node_modules\/(?:react|react-dom|scheduler)\//,
            },
            {
              name: "vendor-router",
              test: /node_modules\/react-router(?:-dom)?\//,
            },
            {
              name: "vendor-supabase",
              test: /node_modules\/@supabase\//,
            },
            {
              name: "vendor-icons",
              test: /node_modules\/lucide-react\//,
            },
          ],
        },
      },
    },
  },
});
