import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules/three')) return 'vendor-three';
                    if (id.includes('node_modules/lil-gui')) return 'vendor-gui';
                    if (id.includes('node_modules/delaunator')) return 'vendor-geo';
                }
            }
        }
    }
});
