import GUI from 'lil-gui';
import { migrateGlobeConfig, toSerializableGlobeConfig } from '../config/globeConfig.js';

/**
 * Debug/editor GUI that edits globe settings and handles config import/export.
 */
export class DebugControls {
    constructor(scene, renderer, globeGroup, handlers = {}) {
        this.scene = scene;
        this.renderer = renderer;
        this.globeGroup = globeGroup;
        this.handlers = handlers;
        this.gui = new GUI();
        this.gui.title('Globe Settings');

        this.settings = {
            // Appearance & Colors
            highlightColor: '#ffffff',
            defaultColor: '#000000',
            outlineColor: '#ffffff',
            outlineOpacity: 1.0,
            baseSphereColor: '#00050a',
            baseSphereOpacity: 1.0,
            globalOpacity: 1.0,
            gridColor: '#ffffff',
            backgroundColor: '#0a0a0f',
            transparentBackground: false,
            haloColor: '#4040ff',
            ambientColor: '#101020',
            dirLightColor: '#ffffff',
            rimLightColor: '#4444ff',
            ambientEnabled: true,
            dirLightEnabled: true,
            rimLightEnabled: true,
            fillLightEnabled: true,
            fillLightSkyColor: '#000000',
            fillLightGroundColor: '#111133',

            // Lighting Intensities
            ambientIntensity: 0.5,
            dirLightIntensity: 1.2,
            rimLightIntensity: 2.0,
            fillLightIntensity: 0.5,

            // Atmosphere
            showHalo: true,
            haloIntensity: 0.7,
            haloPower: 15.0,

            // Grid
            showGrid: true,
            gridOpacity: 0.35,
            gridSpacing: 20,
            gridRadius: 1.001,
            gridSegmentSize: 1,

            // Data
            geoJsonResolution: '110m',
            progressiveLoading: true,
            batchSize: 20,

            // Performance
            qualityPreset: 'high',
            rendererPixelRatioMax: 2.0,
            sphereSegments: 128,
            countryFillDetail: 1.0,
            outlineDetail: 1.0,

            // Layout
            globeScale: 1.0,
            showCameraOutline: false,
            cameraOutlineColor: '#ffffff',
            cameraOutlineWidth: 0.02,
            cameraOutlineRadiusFactor: 1.0,

            // Interaction
            autoRotate: false,
            autoRotateSpeed: 1.0,
            inertia: true,
            inertiaFriction: 0.95,
            lockRotationX: false,

            // Selection
            countrySearch: '',
            selectedCodes: ['DEU', 'FRA', 'ESP'],
            clearAllSelected: () => this.clearAllSelected(),
            exportConfig: () => this.exportConfig(),
            importConfig: () => this.importConfig()
        };

        this.countryList = [];
        this.configImportInput = this.createConfigImportInput();
        this.setupGUI();
    }

    setupGUI() {
        const countryFolder = this.gui.addFolder('Countries');
        countryFolder.addColor(this.settings, 'highlightColor').name('Visited Color').onChange(() => this.reloadCountries());
        countryFolder.addColor(this.settings, 'defaultColor').name('Base Country Color').onChange(() => this.reloadCountries());
        countryFolder.addColor(this.settings, 'outlineColor').name('Outline Color').onChange(() => this.reloadCountries());
        countryFolder.add(this.settings, 'outlineOpacity', 0, 1, 0.05).name('Outline Opacity').onChange(() => this.reloadCountries());

        const sceneFolder = this.gui.addFolder('Scene');
        sceneFolder.addColor(this.settings, 'baseSphereColor').name('Sphere Color').onChange(() => this.updateSceneVisuals());
        sceneFolder.add(this.settings, 'baseSphereOpacity', 0, 1, 0.05).name('Sphere Opacity').onChange(() => this.updateSceneVisuals());
        sceneFolder.add(this.settings, 'globalOpacity', 0, 1, 0.05).name('Global Opacity').onChange(() => this.updateSceneVisuals());
        sceneFolder.addColor(this.settings, 'backgroundColor').name('Background').onChange(() => this.updateSceneVisuals());
        sceneFolder.add(this.settings, 'transparentBackground').name('Transparent BG').onChange(() => this.updateSceneVisuals());

        const gridFolder = this.gui.addFolder('Grid');
        gridFolder.add(this.settings, 'showGrid').name('Show Grid').onChange(() => this.reloadGrid());
        gridFolder.addColor(this.settings, 'gridColor').name('Grid Color').onChange(() => this.reloadGrid());
        gridFolder.add(this.settings, 'gridOpacity', 0, 1, 0.05).name('Grid Opacity').onChange(() => this.reloadGrid());
        gridFolder.add(this.settings, 'gridSpacing', 5, 45, 5).name('Spacing').onChange(() => this.reloadGrid());
        gridFolder.add(this.settings, 'gridRadius', 1.0, 1.02, 0.001).name('Height').onChange(() => this.reloadGrid());
        gridFolder.add(this.settings, 'gridSegmentSize', 1, 10, 1).name('Segment Size').onChange(() => this.reloadGrid());

        const atmosphereFolder = this.gui.addFolder('Atmosphere');
        atmosphereFolder.addColor(this.settings, 'haloColor').name('Color').onChange(() => this.updateEffects());
        atmosphereFolder.add(this.settings, 'showHalo').name('Visible').onChange(() => this.updateEffects());
        atmosphereFolder.add(this.settings, 'haloIntensity', 0, 1).name('Glow').onChange(() => this.updateEffects());
        atmosphereFolder.add(this.settings, 'haloPower', 1, 50).name('Falloff').onChange(() => this.updateEffects());

        const lightsFolder = this.gui.addFolder('Lights');
        lightsFolder.addColor(this.settings, 'ambientColor').name('Ambient Color').onChange(() => this.updateLighting());
        lightsFolder.add(this.settings, 'ambientIntensity', 0, 2).name('Ambient Intensity').onChange(() => this.updateLighting());
        lightsFolder.add(this.settings, 'ambientEnabled').name('Ambient On').onChange(() => this.updateLighting());
        lightsFolder.addColor(this.settings, 'dirLightColor').name('Main Color').onChange(() => this.updateLighting());
        lightsFolder.add(this.settings, 'dirLightIntensity', 0, 5).name('Main Intensity').onChange(() => this.updateLighting());
        lightsFolder.add(this.settings, 'dirLightEnabled').name('Main On').onChange(() => this.updateLighting());
        lightsFolder.addColor(this.settings, 'rimLightColor').name('Rim Color').onChange(() => this.updateLighting());
        lightsFolder.add(this.settings, 'rimLightIntensity', 0, 10).name('Rim Intensity').onChange(() => this.updateLighting());
        lightsFolder.add(this.settings, 'rimLightEnabled').name('Rim On').onChange(() => this.updateLighting());
        lightsFolder.addColor(this.settings, 'fillLightSkyColor').name('Fill Sky Color').onChange(() => this.updateLighting());
        lightsFolder.addColor(this.settings, 'fillLightGroundColor').name('Fill Ground Color').onChange(() => this.updateLighting());
        lightsFolder.add(this.settings, 'fillLightIntensity', 0, 3).name('Fill Intensity').onChange(() => this.updateLighting());
        lightsFolder.add(this.settings, 'fillLightEnabled').name('Fill On').onChange(() => this.updateLighting());

        this.selectionFolder = this.gui.addFolder('Country Selection');
        this.countrySearchController = this.selectionFolder
            .add(this.settings, 'countrySearch')
            .name('Search')
            .onChange((value) => this.updateSearchSuggestions(value));
        this.suggestionsFolder = this.selectionFolder.addFolder('Suggestions');
        this.selectedListFolder = this.selectionFolder.addFolder('Selected List');
        this.selectionFolder.add(this.settings, 'clearAllSelected').name('Clear All');
        this.refreshSelectedListUI();

        const dataFolder = this.gui.addFolder('Data');
        dataFolder.add(this.settings, 'progressiveLoading').name('Progressive').onChange(() => this.reloadCountries());
        dataFolder.add(this.settings, 'batchSize', 5, 100, 5).name('Batch Size').onChange(() => this.reloadCountries());

        const perfFolder = this.gui.addFolder('Performance');
        perfFolder.add(this.settings, 'qualityPreset', ['low', 'medium', 'high']).name('Quality Preset').onChange(() => this.updatePerformance());
        perfFolder.add(this.settings, 'rendererPixelRatioMax', 0.5, 3.0, 0.1).name('Pixel Ratio Max').onChange(() => this.updatePerformance());
        perfFolder.add(this.settings, 'sphereSegments', 16, 256, 16).name('Sphere Segments').onChange(() => this.updatePerformance());
        perfFolder.add(this.settings, 'countryFillDetail', 0.5, 3.0, 0.1).name('Fill Detail').onChange(() => this.updatePerformance());
        perfFolder.add(this.settings, 'outlineDetail', 0.5, 3.0, 0.1).name('Outline Detail').onChange(() => this.updatePerformance());

        const layoutFolder = this.gui.addFolder('Layout');
        layoutFolder.add(this.settings, 'globeScale', 0.25, 4.0, 0.01).name('Globe Scale').onChange(() => this.updateSceneVisuals());
        layoutFolder.add(this.settings, 'showCameraOutline').name('Screen Ring').onChange(() => this.updateSceneVisuals());
        layoutFolder.addColor(this.settings, 'cameraOutlineColor').name('Screen Ring Color').onChange(() => this.updateSceneVisuals());
        layoutFolder.add(this.settings, 'cameraOutlineWidth', 0.001, 0.2, 0.001).name('Screen Ring Width').onChange(() => this.updateSceneVisuals());
        layoutFolder.add(this.settings, 'cameraOutlineRadiusFactor', 0.5, 2.0, 0.01).name('Screen Ring Size').onChange(() => this.updateSceneVisuals());

        const interactionFolder = this.gui.addFolder('Interaction');
        interactionFolder.add(this.settings, 'autoRotate').name('Auto Rotate').onChange(() => this.updateRotation());
        interactionFolder.add(this.settings, 'autoRotateSpeed', 0, 5, 0.1).name('Speed').onChange(() => this.updateRotation());
        interactionFolder.add(this.settings, 'inertia').name('Inertia').onChange(() => this.updateRotation());
        interactionFolder.add(this.settings, 'inertiaFriction', 0.8, 0.999, 0.001).name('Friction').onChange(() => this.updateRotation());
        interactionFolder.add(this.settings, 'lockRotationX').name('Lock X Axis').onChange(() => this.updateRotation());

        const configFolder = this.gui.addFolder('Config');
        configFolder.add(this.settings, 'exportConfig').name('Export JSON');
        configFolder.add(this.settings, 'importConfig').name('Import JSON');
    }

    updateRotation() {
        if (this.handlers.onUpdateRotationSettings) {
            this.handlers.onUpdateRotationSettings(this.settings);
        }
    }

    updatePerformance() {
        if (this.handlers.onUpdatePerformance) {
            this.handlers.onUpdatePerformance(this.settings);
        }
    }

    updateSceneVisuals() {
        if (this.handlers.onUpdateSceneVisuals) {
            this.handlers.onUpdateSceneVisuals(this.settings);
        }
    }

    applySettings(settings) {
        const normalized = migrateGlobeConfig(settings);
        const selectedCodes = [...normalized.highlightCodes];

        Object.assign(this.settings, {
            highlightColor: normalized.highlightColor,
            defaultColor: normalized.defaultColor,
            outlineColor: normalized.outlineColor,
            outlineOpacity: normalized.outlineOpacity,
            baseSphereColor: normalized.baseSphereColor,
            baseSphereOpacity: normalized.baseSphereOpacity,
            globalOpacity: normalized.globalOpacity,
            gridColor: normalized.gridColor,
            backgroundColor: normalized.backgroundColor,
            transparentBackground: normalized.transparentBackground,
            haloColor: normalized.haloColor,
            ambientColor: normalized.ambientColor,
            dirLightColor: normalized.dirLightColor,
            rimLightColor: normalized.rimLightColor,
            ambientEnabled: normalized.ambientEnabled,
            dirLightEnabled: normalized.dirLightEnabled,
            rimLightEnabled: normalized.rimLightEnabled,
            fillLightEnabled: normalized.fillLightEnabled,
            fillLightSkyColor: normalized.fillLightSkyColor,
            fillLightGroundColor: normalized.fillLightGroundColor,
            ambientIntensity: normalized.ambientIntensity,
            dirLightIntensity: normalized.dirLightIntensity,
            rimLightIntensity: normalized.rimLightIntensity,
            fillLightIntensity: normalized.fillLightIntensity,
            showHalo: normalized.showHalo,
            haloIntensity: normalized.haloIntensity,
            haloPower: normalized.haloPower,
            showGrid: normalized.showGrid,
            gridOpacity: normalized.gridOpacity,
            gridSpacing: normalized.gridSpacing,
            gridRadius: normalized.gridRadius,
            gridSegmentSize: normalized.gridSegmentSize,
            geoJsonResolution: normalized.geoJsonResolution,
            progressiveLoading: normalized.progressiveLoading,
            batchSize: normalized.batchSize,
            qualityPreset: normalized.qualityPreset,
            rendererPixelRatioMax: normalized.rendererPixelRatioMax,
            sphereSegments: normalized.sphereSegments,
            countryFillDetail: normalized.countryFillDetail,
            outlineDetail: normalized.outlineDetail,
            globeScale: normalized.globeScale,
            showCameraOutline: normalized.showCameraOutline,
            cameraOutlineColor: normalized.cameraOutlineColor,
            cameraOutlineWidth: normalized.cameraOutlineWidth,
            cameraOutlineRadiusFactor: normalized.cameraOutlineRadiusFactor,
            autoRotate: normalized.autoRotate,
            autoRotateSpeed: normalized.autoRotateSpeed,
            inertia: normalized.inertia,
            inertiaFriction: normalized.inertiaFriction,
            lockRotationX: normalized.lockRotationX,
            selectedCodes
        });

        this.gui.controllersRecursive().forEach((controller) => controller.updateDisplay());
        this.refreshSelectedListUI();
        this.updateSearchSuggestions(this.settings.countrySearch);
    }

    setGeojsonData(data) {
        this.geojsonData = data;
        this.countryList = data.features.map(f => ({
            name: f.properties.NAME,
            code: f.properties.ADM0_A3 || f.properties.ISO_A3 || f.properties.SOV_A3
        })).sort((a, b) => a.name.localeCompare(b.name));

        this.countryList = this.countryList.filter((v, i, a) => a.findIndex(t => t.code === v.code) === i);

        this.updateSearchSuggestions(this.settings.countrySearch);
        this.refreshSelectedListUI();
    }

    updateSearchSuggestions(query) {
        if (!this.suggestionsFolder) return;

        const controllers = [...this.suggestionsFolder.controllers];
        controllers.forEach(c => c.destroy());

        if (!query || query.length < 2) {
            this.suggestionsFolder.close();
            return;
        }

        const filtered = this.countryList.filter(c =>
            c.name.toLowerCase().includes(query.toLowerCase()) ||
            c.code.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 10);

        filtered.forEach(c => {
            const obj = {};
            obj[`Add ${c.name}`] = () => {
                this.addCountry(c.code);
                this.settings.countrySearch = '';
                if (this.countrySearchController) this.countrySearchController.updateDisplay();
                this.updateSearchSuggestions('');
            };
            this.suggestionsFolder.add(obj, `Add ${c.name}`);
        });

        if (filtered.length > 0) {
            this.suggestionsFolder.open();
        } else {
            this.suggestionsFolder.close();
        }
    }

    addCountry(iso) {
        if (!this.settings.selectedCodes.includes(iso)) {
            this.settings.selectedCodes.push(iso);
            this.notifySelectionChange();
            this.refreshSelectedListUI();
        }
    }

    removeCountry(iso) {
        const index = this.settings.selectedCodes.indexOf(iso);
        if (index > -1) {
            this.settings.selectedCodes.splice(index, 1);
            this.notifySelectionChange();
            this.refreshSelectedListUI();
        }
    }

    clearAllSelected() {
        this.settings.selectedCodes = [];
        this.notifySelectionChange();
        this.refreshSelectedListUI();
    }

    updateLighting() {
        if (this.handlers.onUpdateLighting) {
            this.handlers.onUpdateLighting(this.settings);
        }
    }

    updateEffects() {
        if (this.handlers.onUpdateEffects) {
            this.handlers.onUpdateEffects(this.settings);
        }
    }

    notifySelectionChange() {
        if (this.handlers.onUpdateSelectedCountries) {
            this.handlers.onUpdateSelectedCountries({
                selectedCountries: this.settings.selectedCodes
            });
        }
    }

    refreshSelectedListUI() {
        if (!this.selectedListFolder) return;

        const controllers = [...this.selectedListFolder.controllers];
        controllers.forEach(c => c.destroy());

        const folders = [...this.selectedListFolder.folders];
        folders.forEach(f => f.destroy());

        this.settings.selectedCodes.forEach(iso => {
            const country = this.countryList.find(c => c.code === iso);
            const label = country ? country.name : iso;
            const obj = {};
            obj[`Remove ${label}`] = () => this.removeCountry(iso);
            this.selectedListFolder.add(obj, `Remove ${label}`);
        });

        if (this.settings.selectedCodes.length > 0) {
            this.selectedListFolder.open();
        }
    }

    reloadCountries() {
        if (this.handlers.onReloadCountries) {
            this.handlers.onReloadCountries({
                resolution: this.settings.geoJsonResolution,
                progressiveLoading: this.settings.progressiveLoading,
                batchSize: this.settings.batchSize,
                highlightColor: this.settings.highlightColor,
                defaultColor: this.settings.defaultColor,
                outlineColor: this.settings.outlineColor,
                outlineOpacity: this.settings.outlineOpacity,
                selectedCountries: this.settings.selectedCodes
            });
        }
    }

    reloadGrid() {
        if (this.handlers.onReloadGrid) {
            this.handlers.onReloadGrid({
                showGrid: this.settings.showGrid,
                gridColor: this.settings.gridColor,
                gridSpacing: this.settings.gridSpacing,
                gridRadius: this.settings.gridRadius,
                gridSegmentSize: this.settings.gridSegmentSize,
                gridOpacity: this.settings.gridOpacity
            });
        }
    }

    exportConfig() {
        const runtimeState = this.handlers.onRequestRuntimeState
            ? this.handlers.onRequestRuntimeState()
            : { rotationX: 0, rotationY: 0 };

        const payload = toSerializableGlobeConfig({
            ...this.settings,
            ...runtimeState,
            highlightCodes: [...this.settings.selectedCodes]
        });

        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'globe-config.json';
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        URL.revokeObjectURL(url);
    }

    importConfig() {
        this.configImportInput.value = '';
        this.configImportInput.click();
    }

    createConfigImportInput() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json,.json';
        input.style.display = 'none';
        input.addEventListener('change', async (event) => {
            const file = event.target.files && event.target.files[0];
            if (!file) return;
            try {
                const text = await file.text();
                const config = JSON.parse(text);
                if (this.handlers.onImportConfig) {
                    this.handlers.onImportConfig(config);
                }
            } catch (error) {
                console.error('Failed to import config:', error);
            }
        });
        document.body.appendChild(input);
        return input;
    }

    destroy() {
        this.gui.destroy();
        if (this.configImportInput && this.configImportInput.parentNode) {
            this.configImportInput.parentNode.removeChild(this.configImportInput);
        }
    }

    getSettings() {
        return this.settings;
    }
}
