import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
    build: {
        outDir: 'dist-lib',
        emptyOutDir: true,
        lib: {
            entry: resolve(__dirname, 'src/index.js'),
            name: 'Travel3DGlobe',
            formats: ['es'],
            fileName: () => 'travel3dglobe.js'
        },
        rollupOptions: {
            external: (id) => id === 'three' || id.startsWith('three/'),
            output: {
                globals: {
                    three: 'THREE'
                }
            }
        }
    }
});
