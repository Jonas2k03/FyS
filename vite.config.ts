import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Detectar si es un repo de usuario/organización (usuario.github.io)
// o un repo normal (usuario/repo)
// Por defecto, si VITE_BASE no está definido, usamos el nombre del repo
const REPO_NAME = 'love-dashboard-sebas'
const BASE = process.env.VITE_BASE ?? `/${REPO_NAME}/`

// https://vite.dev/config/
export default defineConfig({
  base: BASE,
  plugins: [react()],
})
