import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    _COLOR: JSON.stringify({
        lightest: "#EAE7DC",
        less_light: "#3D3D3D",
        more_light: "#EAE7DC",
        medium: "#4A5759",
        dark: "#2A2D34",
        darkest: "#1C1C1C",
        buttons: "#2192FF",
        input: "#474E68"
      }),
    },
})
