import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
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
