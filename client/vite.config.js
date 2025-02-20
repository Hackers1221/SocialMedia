import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    _COLOR: JSON.stringify({
      lightest: "#ffffff", 
      light: "#d9d9d9", 
      medium: "#3c6e71",
      dark: "#284b63", 
      darkest: "#353535"}),
    },
})
