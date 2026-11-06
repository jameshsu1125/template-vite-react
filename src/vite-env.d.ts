/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MOCKING: string;
  readonly VITE_API_PATH: string;
  readonly VITE_IMAGE_SOURCE: 'local' | 'cdn';
  readonly VITE_CDN_URL: string;
  readonly VITE_CDN_FOLDER: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
