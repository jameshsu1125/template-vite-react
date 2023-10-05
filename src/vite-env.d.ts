/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_TITLE: string;
	readonly VITE_SUBSCRIPTION: string;
	readonly VITE_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
