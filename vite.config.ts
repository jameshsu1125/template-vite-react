import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createHtmlPlugin } from 'vite-plugin-html';

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
	plugins: [
		react(),
		createHtmlPlugin({
			minify: true,
			pages: [
				{
					entry: 'src/pages/index.tsx',
					filename: 'index.html',
					template: '/template/index.html',
					injectOptions: {
						data: {
							title: 'index',
							injectScript: `<script src="./index.js"></script>`,
						},
					},
				},
			],
		}),
	],
});
