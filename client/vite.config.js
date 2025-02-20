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
<<<<<<< HEAD
      darkest: "#FFDDAE"
    }),
    FONTS: JSON.stringify({
      creative: "Arial, sans-serif"
    })
  },
=======
      darkest: "#FFDDAE"}),
    },
>>>>>>> cf11567b25cfc37114d925e6ac6102239a8ff10d
})
