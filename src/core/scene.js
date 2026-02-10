import * as THREE from 'three';

/**
 * Creates an isolated Three.js scene context for a single globe instance.
 */
export function createSceneContext(container = document.body) {
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0a0a0f, 5, 15);
    let pixelRatioMax = Math.min(window.devicePixelRatio, 2);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 3.5);

    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        precision: 'highp',
        powerPreference: 'high-performance'
    });
    const initialSize = getContainerSize();
    renderer.setSize(initialSize.width, initialSize.height);
    renderer.setPixelRatio(pixelRatioMax);
    renderer.sortObjects = true;

    container.appendChild(renderer.domElement);
    window.addEventListener('resize', onWindowResize);
    const resizeObserver = typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(onWindowResize)
        : null;
    if (resizeObserver) {
        resizeObserver.observe(container);
    }

    return {
        scene,
        camera,
        renderer,
        setBackground,
        setPixelRatioMax,
        destroy
    };

    function onWindowResize() {
        const { width, height } = getContainerSize();
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, pixelRatioMax));
    }

    function getContainerSize() {
        const isBodyContainer =
            container === document.body || container === document.documentElement;
        const baseWidth = isBodyContainer ? window.innerWidth : container.clientWidth;
        const baseHeight = isBodyContainer ? window.innerHeight : container.clientHeight;
        const width = Math.max(baseWidth || 0, 1);
        const height = Math.max(baseHeight || 0, 1);
        return { width, height };
    }

    function destroy() {
        window.removeEventListener('resize', onWindowResize);
        if (resizeObserver) {
            resizeObserver.disconnect();
        }
        renderer.dispose();
        if (renderer.domElement.parentNode) {
            renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
    }

    function setBackground(backgroundColor, transparentBackground) {
        scene.background = transparentBackground ? null : new THREE.Color(backgroundColor);
    }

    function setPixelRatioMax(nextPixelRatioMax) {
        pixelRatioMax = Math.max(0.5, Math.min(3, Number(nextPixelRatioMax) || 2));
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, pixelRatioMax));
    }
}
