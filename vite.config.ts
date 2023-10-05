import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
	root: resolve(__dirname, 'src/pages'),
	build: {
		outDir: resolve(__dirname, 'dist'),
		rollupOptions: {
			input: {
				index: resolve(__dirname, 'src/pages/index.html'),
			},
		},
	},
	css: {
		preprocessorOptions: {
			less: {
				math: 'always',
				globalVars: {
					mainColor: 'red',
				},
			},
		},
	},
	plugins: [react()],
});
