import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  define: {
    _COLOR: JSON.stringify({
        background: "#F2F0EF",
        text: "#2b2b2b",
        card: "#FFFFFF",
        buttons: "#0077c0",
        input: "#474E68",
        dropdown: "#FFFFFF",
        buttonsHover: "#2192FF",
        border: "#d4cfcf"
      }),
    },
})

