import { defineConfig } from 'windicss/helpers'

export default defineConfig({
  darkMode: 'class',
  safelist: ["border-sky-500"],
  theme: {
    extend: {
      colors: {
        teal: {
          100: '#096',
        },
      },
    },
  },
})
