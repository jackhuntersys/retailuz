import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import path from "path"
// import componentTagger from "lovable-tagger"

export default defineConfig(({ mode }) => ({
  server: {
    host: true,
    allowedHosts: [
      "localhost",
      ".telegram.org",
      ".ngrok-free.dev",
    ],
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}))
