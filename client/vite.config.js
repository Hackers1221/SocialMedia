import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    _COLOR: JSON.stringify({
      lightest: "#ffffff",
      less_light: "#ced4da",
      more_light: "#adb5bd", 
      light: "#495057", 
      medium: "#495057",
      dark: "#343a40", 
      darkest: "#212529"}),
    },
})
