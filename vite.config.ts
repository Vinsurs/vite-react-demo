import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import WindiCSS from 'vite-plugin-windicss'
import { resolve as pathResolve, sep } from "path"

function resolve(dir: string) {
  return pathResolve(process.cwd(), ".", dir).concat(sep)
}
const replacement = resolve("src/")
console.log("replacement", replacement)
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), WindiCSS()],
  resolve: {
    alias: [
      {
        find: /^\/@\//,
        replacement: resolve("src")
      }
    ]
  }
})
