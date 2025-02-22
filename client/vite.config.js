import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    _COLOR: JSON.stringify({
      // lightest: "#ffffff",
      // less_light: "#ced4da",
      // more_light: "#adb5bd", 
      // light: "#495057", 
      // medium: "#495057",
      // dark: "#343a40", 
      // darkest: "#212529",
        lightest: "#EAE7DC",
        less_light: "#B5C0D0",
        more_light: "#A77979",
        medium: "#4A5759",
        dark: "#2A2D34",
        darkest: "#1C1C1C"
      }),
    },
})
