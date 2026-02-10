import * as THREE from 'three';
import { createSceneContext } from './scene.js';
import { createLightingController } from './lighting.js';
import { createRotationController } from './events.js';
import { addLatLonGrid } from '../utils/latLonGrid.js';
import { createSnippetHalo, updateSnippetHalo } from '../utils/halo.js';
import {
    DEFAULT_GLOBE_CONFIG,
    getGeoJsonUrlForResolution,
    migrateGlobeConfig,
    toSerializableGlobeConfig
} from '../config/globeConfig.js';

/**
 * Embeddable globe lifecycle: init, config updates, rendering, and teardown.
 */
const BASE_RADIUS = 1.0;

export async function createGlobe(options = {}) {
    const container = options.container || document.body;
    const enableDebugPanel = options.enableDebugPanel !== false;

    let globeGroup;
    let debugControls;
    let geojsonData;
    let isLoadingCountries = false;
    let haloMesh;
    let sphereMesh;
    let cameraOutlineMesh;
    let rafId = null;
    let destroyed = false;
    let loadCountriesFnPromise;
    let debugControlsClassPromise;
    let rotationController;
    let sceneContext;
    let lightingController;
    let currentSettings = migrateGlobeConfig({
        ...DEFAULT_GLOBE_CONFIG,
        ...(options.config || {})
    });

    applyQualityPreset(currentSettings);
    currentSettings.geoJsonUrl = getGeoJsonUrlForResolution(currentSettings.geoJsonResolution);
    sceneContext = createSceneContext(container);
    sceneContext.setBackground(currentSettings.backgroundColor, currentSettings.transparentBackground);
    sceneContext.setPixelRatioMax(currentSettings.rendererPixelRatioMax);
    lightingController = createLightingController(sceneContext.scene, currentSettings);

    await initGlobe();
    if (enableDebugPanel) {
        await setupDebugPanel();
    }
    applyRotationSettings();

    return {
        setConfig,
        getConfig,
        destroy
    };

    async function getLoadCountriesFn() {
        if (!loadCountriesFnPromise) {
            loadCountriesFnPromise = import('../globe/createCountries.js').then((m) => m.loadCountries);
        }
        return loadCountriesFnPromise;
    }

    async function getDebugControlsClass() {
        if (!debugControlsClassPromise) {
            debugControlsClassPromise = import('../debug/controls.js').then((m) => m.DebugControls);
        }
        return debugControlsClassPromise;
    }

    async function initGlobe() {
        globeGroup = new THREE.Group();
        sceneContext.scene.add(globeGroup);

        rebuildSphere();
        applyRuntimeState(currentSettings);
        applySceneVisuals();

        haloMesh = createSnippetHalo(BASE_RADIUS, 1.15, currentSettings.haloColor, 64);
        updateSnippetHalo(haloMesh, currentSettings);
        haloMesh.renderOrder = 1;
        sceneContext.scene.add(haloMesh);
        applySceneVisuals();

        rebuildGrid();

        rotationController = createRotationController(globeGroup, sceneContext.renderer.domElement, currentSettings);

        await reloadCountries();
        animate();
    }

    async function setupDebugPanel() {
        const DebugControls = await getDebugControlsClass();
        debugControls = new DebugControls(sceneContext.scene, sceneContext.renderer, globeGroup, {
            onReloadCountries: handleReloadCountries,
            onUpdateSelectedCountries: handleUpdateSelectedCountries,
            onReloadGrid: handleReloadGrid,
            onUpdateLighting: handleUpdateLighting,
            onUpdateEffects: handleUpdateEffects,
            onUpdateSceneVisuals: handleUpdateSceneVisuals,
            onUpdatePerformance: handleUpdatePerformance,
            onUpdateRotationSettings: handleUpdateRotationSettings,
            onImportConfig: (config) => void setConfig(config),
            onRequestRuntimeState: getRuntimeState
        });
        debugControls.applySettings(currentSettings);
        if (geojsonData) {
            debugControls.setGeojsonData(geojsonData);
        }
    }

    function animate() {
        if (destroyed) return;
        rafId = requestAnimationFrame(animate);
        if (rotationController) {
            rotationController.update();
        }
        updateCameraOutline();
        sceneContext.renderer.render(sceneContext.scene, sceneContext.camera);
    }

    async function setConfig(nextConfig) {
        if (destroyed) return;

        currentSettings = migrateGlobeConfig({
            ...currentSettings,
            ...(nextConfig || {})
        });
        applyQualityPreset(currentSettings);
        currentSettings.geoJsonUrl = getGeoJsonUrlForResolution(currentSettings.geoJsonResolution);

        applyRuntimeState(currentSettings);
        lightingController.update(currentSettings);
        if (haloMesh) updateSnippetHalo(haloMesh, currentSettings);
        applyRotationSettings();
        applySceneVisuals();
        rebuildSphere();
        rebuildGrid();

        if (debugControls) {
            debugControls.applySettings(currentSettings);
        }

        await reloadCountries();
    }

    function getConfig() {
        const runtimeState = getRuntimeState();
        return toSerializableGlobeConfig({
            ...currentSettings,
            ...runtimeState
        });
    }

    async function reloadCountries() {
        if (destroyed || !globeGroup) return;
        if (isLoadingCountries) {
            console.warn('Already loading countries, skipping reload...');
            return;
        }

        isLoadingCountries = true;
        clearCountries();

        const loadCountries = await getLoadCountriesFn();
        await loadCountries(
            globeGroup,
            currentSettings.geoJsonUrl,
            currentSettings.highlightCodes,
            false,
            currentSettings
        ).then((data) => {
            geojsonData = data;
            if (debugControls) {
                debugControls.setGeojsonData(geojsonData);
            }
        }).finally(() => {
            isLoadingCountries = false;
        });
    }

    function applyRotationSettings() {
        if (rotationController) {
            rotationController.setSettings(currentSettings);
        }
    }

    function applyRuntimeState(settings) {
        if (!globeGroup) return;
        globeGroup.rotation.x = settings.rotationX;
        globeGroup.rotation.y = settings.rotationY;
    }

    function applySceneVisuals() {
        if (sceneContext) {
            sceneContext.setBackground(currentSettings.backgroundColor, currentSettings.transparentBackground);
            sceneContext.setPixelRatioMax(currentSettings.rendererPixelRatioMax);
        }

        if (sphereMesh && sphereMesh.material) {
            sphereMesh.material.color.setStyle(currentSettings.baseSphereColor);
            const sphereOpacity = currentSettings.baseSphereOpacity * currentSettings.globalOpacity;
            sphereMesh.material.opacity = sphereOpacity;
            sphereMesh.material.transparent = sphereOpacity < 1.0;
        }

        if (globeGroup) {
            globeGroup.scale.setScalar(currentSettings.globeScale);
        }

        if (haloMesh) {
            haloMesh.scale.setScalar(1.15 * currentSettings.globeScale);
        }

        rebuildCameraOutline();
    }

    function rebuildSphere() {
        if (!globeGroup) return;
        if (sphereMesh) {
            sphereMesh.geometry.dispose();
            sphereMesh.material.dispose();
            globeGroup.remove(sphereMesh);
            sphereMesh = null;
        }

        const sphereGeo = new THREE.SphereGeometry(BASE_RADIUS, currentSettings.sphereSegments, currentSettings.sphereSegments);
        const sphereOpacity = currentSettings.baseSphereOpacity * currentSettings.globalOpacity;
        const sphereMat = new THREE.MeshStandardMaterial({
            color: currentSettings.baseSphereColor,
            roughness: 1.0,
            metalness: 0.0,
            transparent: sphereOpacity < 1.0,
            opacity: sphereOpacity
        });
        sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
        sphereMesh.renderOrder = 0;
        globeGroup.add(sphereMesh);
    }

    function rebuildGrid() {
        clearGrid();
        addLatLonGrid(
            globeGroup,
            currentSettings.gridRadius,
            currentSettings.gridSpacing,
            currentSettings.gridSpacing,
            currentSettings.gridSegmentSize,
            currentSettings.gridColor
        );
        globeGroup.traverse((child) => {
            if (child.type === 'Line' && child.renderOrder === 2) {
                child.material.opacity = currentSettings.gridOpacity * currentSettings.globalOpacity;
                child.material.transparent = child.material.opacity < 1.0;
                child.visible = currentSettings.showGrid;
            }
        });
    }

    function rebuildCameraOutline() {
        if (!sceneContext) return;
        if (cameraOutlineMesh) {
            cameraOutlineMesh.geometry.dispose();
            cameraOutlineMesh.material.dispose();
            sceneContext.scene.remove(cameraOutlineMesh);
            cameraOutlineMesh = null;
        }

        if (!currentSettings.showCameraOutline) return;

        const radius = BASE_RADIUS * currentSettings.globeScale * currentSettings.cameraOutlineRadiusFactor;
        const width = currentSettings.cameraOutlineWidth;
        const innerRadius = Math.max(radius - width * 0.5, 0.001);
        const outerRadius = radius + width * 0.5;
        const geometry = new THREE.RingGeometry(innerRadius, outerRadius, 128);
        const material = new THREE.MeshBasicMaterial({
            color: currentSettings.cameraOutlineColor,
            transparent: true,
            opacity: 1.0,
            side: THREE.DoubleSide,
            depthTest: false,
            depthWrite: false
        });

        cameraOutlineMesh = new THREE.Mesh(geometry, material);
        cameraOutlineMesh.renderOrder = 1000;
        sceneContext.scene.add(cameraOutlineMesh);
    }

    function updateCameraOutline() {
        if (!cameraOutlineMesh || !globeGroup) return;
        cameraOutlineMesh.position.copy(globeGroup.position);
        cameraOutlineMesh.quaternion.copy(sceneContext.camera.quaternion);
    }

    function clearCountries() {
        const toRemove = [];
        globeGroup.traverse((child) => {
            if ((child.type === 'Mesh' && child.renderOrder === 3) ||
                (child.type === 'LineLoop' && child.renderOrder === 4)) {
                toRemove.push(child);
            }
        });

        toRemove.forEach((child) => {
            child.geometry.dispose();
            child.material.dispose();
            globeGroup.remove(child);
        });
    }

    function clearGrid() {
        if (!globeGroup) return;
        const toRemove = [];
        globeGroup.traverse((child) => {
            if (child.type === 'Line' && child.renderOrder === 2) {
                toRemove.push(child);
            }
        });

        toRemove.forEach((child) => {
            child.geometry.dispose();
            child.material.dispose();
            globeGroup.remove(child);
        });
    }

    function clearBaseObjects() {
        if (!globeGroup) return;
        if (sphereMesh) {
            sphereMesh.geometry.dispose();
            sphereMesh.material.dispose();
            globeGroup.remove(sphereMesh);
            sphereMesh = null;
        }
    }

    function destroy() {
        if (destroyed) return;
        destroyed = true;

        if (rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }

        if (debugControls) {
            debugControls.destroy();
            debugControls = null;
        }

        if (rotationController) {
            rotationController.destroy();
            rotationController = null;
        }

        clearCountries();
        clearGrid();
        clearBaseObjects();

        if (haloMesh) {
            if (haloMesh.geometry) haloMesh.geometry.dispose();
            if (haloMesh.material) haloMesh.material.dispose();
            sceneContext.scene.remove(haloMesh);
            haloMesh = null;
        }

        if (cameraOutlineMesh) {
            if (cameraOutlineMesh.geometry) cameraOutlineMesh.geometry.dispose();
            if (cameraOutlineMesh.material) cameraOutlineMesh.material.dispose();
            sceneContext.scene.remove(cameraOutlineMesh);
            cameraOutlineMesh = null;
        }

        if (globeGroup) {
            sceneContext.scene.remove(globeGroup);
            globeGroup = null;
        }

        if (lightingController) {
            lightingController.destroy();
            lightingController = null;
        }

        if (sceneContext) {
            sceneContext.destroy();
            sceneContext = null;
        }
    }

    function handleReloadCountries(detail) {
        const {
            resolution,
            progressiveLoading,
            batchSize,
            highlightColor,
            defaultColor,
            outlineColor,
            outlineOpacity,
            selectedCountries
        } = detail;

        currentSettings.geoJsonResolution = resolution;
        currentSettings.geoJsonUrl = getGeoJsonUrlForResolution(resolution);
        currentSettings.progressiveLoading = progressiveLoading;
        currentSettings.batchSize = batchSize;
        currentSettings.highlightColor = highlightColor;
        currentSettings.defaultColor = defaultColor;
        currentSettings.outlineColor = outlineColor;
        currentSettings.outlineOpacity = outlineOpacity;

        if (selectedCountries) {
            currentSettings.highlightCodes = [...selectedCountries];
        }

        void reloadCountries();
    }

    function handleUpdateSelectedCountries(detail) {
        currentSettings.highlightCodes = [...detail.selectedCountries];
        void reloadCountries();
    }

    function handleReloadGrid(detail) {
        Object.assign(currentSettings, detail);
        rebuildGrid();
    }

    function handleUpdateLighting(detail) {
        Object.assign(currentSettings, detail);
        lightingController.update(currentSettings);
    }

    function handleUpdateEffects(detail) {
        Object.assign(currentSettings, detail);
        if (haloMesh) updateSnippetHalo(haloMesh, currentSettings);
    }

    function handleUpdateSceneVisuals(detail) {
        Object.assign(currentSettings, detail);
        applySceneVisuals();
        if (haloMesh) updateSnippetHalo(haloMesh, currentSettings);
        if (detail.gridColor || detail.gridSegmentSize || detail.gridRadius || detail.gridSpacing) {
            rebuildGrid();
        }
        if (detail.globalOpacity !== undefined) {
            rebuildGrid();
            void reloadCountries();
        }
    }

    function handleUpdatePerformance(detail) {
        Object.assign(currentSettings, detail);
        applyQualityPreset(currentSettings);
        currentSettings.geoJsonUrl = getGeoJsonUrlForResolution(currentSettings.geoJsonResolution);
        applySceneVisuals();
        rebuildSphere();
        rebuildGrid();
        void reloadCountries();
    }

    function handleUpdateRotationSettings(detail) {
        Object.assign(currentSettings, detail);
        applyRotationSettings();
    }

    function getRuntimeState() {
        return globeGroup
            ? { rotationX: globeGroup.rotation.x, rotationY: globeGroup.rotation.y }
            : { rotationX: 0, rotationY: 0 };
    }

    function applyQualityPreset(settings) {
        if (settings.qualityPreset === 'low') {
            settings.rendererPixelRatioMax = 1.0;
            settings.gridSegmentSize = 4;
            settings.outlineDetail = 0.6;
            settings.countryFillDetail = 2.0;
            settings.sphereSegments = 48;
            settings.progressiveLoading = true;
            settings.batchSize = 60;
            settings.geoJsonResolution = '110m';
            return;
        }
        if (settings.qualityPreset === 'medium') {
            settings.rendererPixelRatioMax = 1.5;
            settings.gridSegmentSize = 2;
            settings.outlineDetail = 0.85;
            settings.countryFillDetail = 1.4;
            settings.sphereSegments = 96;
            settings.progressiveLoading = true;
            settings.batchSize = 40;
            if (settings.geoJsonResolution === '10m') settings.geoJsonResolution = '50m';
            return;
        }

        settings.rendererPixelRatioMax = Math.max(2.0, settings.rendererPixelRatioMax);
        settings.gridSegmentSize = Math.min(settings.gridSegmentSize, 2);
        settings.outlineDetail = Math.max(1.0, settings.outlineDetail);
        settings.countryFillDetail = Math.min(settings.countryFillDetail, 1.0);
        settings.sphereSegments = Math.max(settings.sphereSegments, 96);
        settings.progressiveLoading = true;
        settings.batchSize = Math.min(settings.batchSize, 20);
    }
}
