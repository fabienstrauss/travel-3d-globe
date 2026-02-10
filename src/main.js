/**
 * Editor/demo host page bootstrap used by the local/Vercel app.
 */
import { createGlobe } from './index.js';

const params = new URLSearchParams(window.location.search);
const demo = params.get('demo');

if (demo === 'multi') {
    void runMultiInstanceDemo();
} else {
    void createGlobe({
        container: document.body,
        enableDebugPanel: true
    });
}

async function runMultiInstanceDemo() {
    const root = document.createElement('div');
    root.style.display = 'grid';
    root.style.gridTemplateColumns = '1fr 1fr';
    root.style.width = '100vw';
    root.style.height = '100vh';
    root.style.background = '#000000';

    const left = document.createElement('div');
    const right = document.createElement('div');
    left.style.position = 'relative';
    right.style.position = 'relative';
    root.appendChild(left);
    root.appendChild(right);

    document.body.innerHTML = '';
    document.body.appendChild(root);

    const globeA = await createGlobe({
        container: left,
        enableDebugPanel: false,
        config: {
            highlightCodes: ['USA', 'CAN', 'MEX'],
            haloColor: '#33aaff',
            showGrid: true
        }
    });

    const globeB = await createGlobe({
        container: right,
        enableDebugPanel: false,
        config: {
            highlightCodes: ['DEU', 'FRA', 'ESP', 'ITA'],
            haloColor: '#ffaa33',
            showGrid: false,
            autoRotate: true,
            autoRotateSpeed: 0.8
        }
    });

    // Expose for quick manual testing in browser devtools.
    window.__globes = { globeA, globeB };
}
