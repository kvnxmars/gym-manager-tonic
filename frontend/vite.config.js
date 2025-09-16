import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.[jt]sx?$/,
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        {
          name: 'load-js-files-as-jsx',
          setup(build) {
            build.onLoad({ filter: /src\/.*\.js$/ }, async (args) => {
              const fs = await import('fs')
              const contents = await fs.promises.readFile(args.path, 'utf8')
              return {
                contents,
                loader: 'jsx',
              }
            })
          },
        },
      ],
    },
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'build'
  }
})
