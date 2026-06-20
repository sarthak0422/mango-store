import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite"; // 1. Add this import

export default defineConfig({
  plugins: [
    tailwindcss(), // 2. Place this BEFORE the react plugin
    react()
  ],
});