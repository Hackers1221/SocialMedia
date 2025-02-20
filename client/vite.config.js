import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    _COLOR: JSON.stringify({
      lightest: "#C6E7FF", 
      light: "#D4F6FF", 
      dark: "#FBFBFB", 
      darkest: "#FFDDAE"}),
    },
})
