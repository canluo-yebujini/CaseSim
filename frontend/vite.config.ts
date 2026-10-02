import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// 开发端口和后端代理端口通过 VITE_DEV_PORT / VITE_BACKEND_PORT 配置，
// 默认开发页面 5174，后端 8110，与 backend/.env.example 保持一致。
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backendPort = env.VITE_BACKEND_PORT || '8110'
  const frontendPort = Number(env.VITE_DEV_PORT || '5174')

  return {
    plugins: [react()],
    server: {
      host: true,
      port: frontendPort,
      proxy: {
        '/api': {
          target: `http://127.0.0.1:${backendPort}`,
          changeOrigin: false,
        },
        '/media': {
          target: `http://127.0.0.1:${backendPort}`,
          changeOrigin: false,
        },
      },
    },
  }
})
