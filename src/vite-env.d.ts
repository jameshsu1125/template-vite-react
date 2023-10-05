/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_TITLE: string;
	readonly VITE_SUBSCRIPTION: string;
	readonly VITE_URL: string;
	readonly VITE_FACEBOOK_ID: string;
	readonly VITE_MOCKING: string;
	readonly VITE_API_PATH: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
