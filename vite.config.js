import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';
import { BASE_PATH } from './src/const';

export default defineConfig({
    base: BASE_PATH,
    plugins: [react()],
    server: {
        open: false,
        port: 3000,
        host: "0.0.0.0"
    },
    resolve: {
        alias: {
            '@components': path.resolve(__dirname, './src/components'),
            '@pages': path.resolve(__dirname, './src/pages'),
            '@const': path.resolve(__dirname, './src/const.js'),
            '@utils': path.resolve(__dirname, './src/utils.js')
        },
    },
})
