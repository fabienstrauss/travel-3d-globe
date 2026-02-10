/**
 * Versioned globe config defaults, validation/coercion, and serialization helpers.
 */
const RESOLUTION_TO_GEOJSON_URL = {
    '110m': '/geojson/ne_110m_admin_0_countries.json',
};

const FIXED_RESOLUTION = '110m';
const HEX_COLOR_REGEX = /^#([0-9a-fA-F]{6})$/;

export const GLOBE_CONFIG_SCHEMA_VERSION = 1;

export const DEFAULT_GLOBE_CONFIG = {
    schemaVersion: GLOBE_CONFIG_SCHEMA_VERSION,
    geoJsonResolution: FIXED_RESOLUTION,
    geoJsonUrl: RESOLUTION_TO_GEOJSON_URL[FIXED_RESOLUTION],
    progressiveLoading: true,
    batchSize: 20,
    highlightCodes: ['DEU', 'FRA', 'ESP'],
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
    ambientColor: '#101020',
    ambientIntensity: 0.5,
    dirLightColor: '#ffffff',
    dirLightIntensity: 1.2,
    dirLightPos: { x: 5, y: 5, z: 5 },
    rimLightColor: '#4444ff',
    rimLightIntensity: 2.0,
    rimLightPos: { x: -5, y: 2, z: -3 },
    ambientEnabled: true,
    dirLightEnabled: true,
    rimLightEnabled: true,
    fillLightEnabled: true,
    fillLightSkyColor: '#000000',
    fillLightGroundColor: '#111133',
    fillLightIntensity: 0.5,
    haloColor: '#4040ff',
    haloIntensity: 0.7,
    haloPower: 15.0,
    showHalo: true,
    showGrid: true,
    gridOpacity: 0.35,
    gridSpacing: 20,
    gridRadius: 1.001,
    gridSegmentSize: 1,
    countryRoughness: 1.0,
    countryMetalness: 0.0,
    countryEmissiveIntensity: 0.0,
    countryOpacity: 1.0,
    countryRadius: 1.01,
    countryFillDetail: 1.0,
    outlineDetail: 1.0,
    qualityPreset: 'high',
    rendererPixelRatioMax: 2.0,
    sphereSegments: 128,
    globeScale: 1.0,
    showCameraOutline: false,
    cameraOutlineColor: '#ffffff',
    cameraOutlineWidth: 0.02,
    cameraOutlineRadiusFactor: 1.0,
    autoRotate: false,
    autoRotateSpeed: 1.0,
    inertia: true,
    inertiaFriction: 0.95,
    lockRotationX: false,
    rotationX: 0,
    rotationY: 0
};

export function getGeoJsonUrlForResolution(resolution) {
    return RESOLUTION_TO_GEOJSON_URL[FIXED_RESOLUTION];
}

export function migrateGlobeConfig(rawConfig) {
    const source = rawConfig && typeof rawConfig === 'object'
        ? (rawConfig.settings && typeof rawConfig.settings === 'object' ? rawConfig.settings : rawConfig)
        : {};
    const merged = {
        ...DEFAULT_GLOBE_CONFIG,
        ...source
    };

    merged.schemaVersion = GLOBE_CONFIG_SCHEMA_VERSION;
    merged.geoJsonResolution = FIXED_RESOLUTION;
    merged.geoJsonUrl = getGeoJsonUrlForResolution(FIXED_RESOLUTION);
    merged.progressiveLoading = Boolean(merged.progressiveLoading);
    merged.batchSize = coerceNumber(merged.batchSize, 20, 5, 100);

    merged.highlightCodes = Array.isArray(merged.highlightCodes)
        ? merged.highlightCodes
            .filter((code) => typeof code === 'string')
            .map((code) => code.trim().toUpperCase())
            .filter((code) => code.length > 0)
        : [...DEFAULT_GLOBE_CONFIG.highlightCodes];

    merged.highlightColor = coerceColor(merged.highlightColor, DEFAULT_GLOBE_CONFIG.highlightColor);
    merged.defaultColor = coerceColor(merged.defaultColor, DEFAULT_GLOBE_CONFIG.defaultColor);
    merged.outlineColor = coerceColor(merged.outlineColor, DEFAULT_GLOBE_CONFIG.outlineColor);
    merged.outlineOpacity = coerceNumber(merged.outlineOpacity, 1.0, 0, 1);
    merged.baseSphereColor = coerceColor(merged.baseSphereColor, DEFAULT_GLOBE_CONFIG.baseSphereColor);
    merged.baseSphereOpacity = coerceNumber(merged.baseSphereOpacity, 1.0, 0, 1);
    merged.globalOpacity = coerceNumber(merged.globalOpacity, 1.0, 0, 1);
    merged.gridColor = coerceColor(merged.gridColor, DEFAULT_GLOBE_CONFIG.gridColor);
    merged.backgroundColor = coerceColor(merged.backgroundColor, DEFAULT_GLOBE_CONFIG.backgroundColor);
    merged.ambientColor = coerceColor(merged.ambientColor, DEFAULT_GLOBE_CONFIG.ambientColor);
    merged.dirLightColor = coerceColor(merged.dirLightColor, DEFAULT_GLOBE_CONFIG.dirLightColor);
    merged.rimLightColor = coerceColor(merged.rimLightColor, DEFAULT_GLOBE_CONFIG.rimLightColor);
    merged.fillLightSkyColor = coerceColor(merged.fillLightSkyColor, DEFAULT_GLOBE_CONFIG.fillLightSkyColor);
    merged.fillLightGroundColor = coerceColor(merged.fillLightGroundColor, DEFAULT_GLOBE_CONFIG.fillLightGroundColor);
    merged.haloColor = coerceColor(merged.haloColor, DEFAULT_GLOBE_CONFIG.haloColor);
    merged.cameraOutlineColor = coerceColor(merged.cameraOutlineColor, DEFAULT_GLOBE_CONFIG.cameraOutlineColor);

    merged.transparentBackground = Boolean(merged.transparentBackground);
    merged.ambientEnabled = Boolean(merged.ambientEnabled);
    merged.dirLightEnabled = Boolean(merged.dirLightEnabled);
    merged.rimLightEnabled = Boolean(merged.rimLightEnabled);
    merged.fillLightEnabled = Boolean(merged.fillLightEnabled);
    merged.ambientIntensity = coerceNumber(merged.ambientIntensity, 0.5, 0, 2);
    merged.dirLightIntensity = coerceNumber(merged.dirLightIntensity, 1.2, 0, 5);
    merged.rimLightIntensity = coerceNumber(merged.rimLightIntensity, 2.0, 0, 10);
    merged.fillLightIntensity = coerceNumber(merged.fillLightIntensity, 0.5, 0, 3);
    merged.haloIntensity = coerceNumber(merged.haloIntensity, 0.7, 0, 1);
    merged.haloPower = coerceNumber(merged.haloPower, 15.0, 1, 50);

    merged.showHalo = Boolean(merged.showHalo);
    merged.showGrid = Boolean(merged.showGrid);
    merged.gridOpacity = coerceNumber(merged.gridOpacity, 0.35, 0, 1);
    merged.gridSpacing = coerceNumber(merged.gridSpacing, 20, 5, 45);
    merged.gridRadius = coerceNumber(merged.gridRadius, 1.001, 1.0, 1.02);
    merged.gridSegmentSize = coerceNumber(merged.gridSegmentSize, 1, 1, 10);

    merged.countryRoughness = coerceNumber(merged.countryRoughness, 1.0, 0, 1);
    merged.countryMetalness = coerceNumber(merged.countryMetalness, 0.0, 0, 1);
    merged.countryEmissiveIntensity = coerceNumber(merged.countryEmissiveIntensity, 0.2, 0, 2);
    merged.countryOpacity = coerceNumber(merged.countryOpacity, 1.0, 0, 1);
    merged.countryRadius = coerceNumber(merged.countryRadius, 1.01, 1.0, 1.03);
    merged.countryFillDetail = coerceNumber(merged.countryFillDetail, 1.0, 0.5, 3.0);
    merged.outlineDetail = coerceNumber(merged.outlineDetail, 1.0, 0.5, 3.0);

    merged.qualityPreset = coerceQualityPreset(merged.qualityPreset);
    merged.rendererPixelRatioMax = coerceNumber(merged.rendererPixelRatioMax, 2.0, 0.5, 3.0);
    merged.sphereSegments = Math.round(coerceNumber(merged.sphereSegments, 128, 16, 256));
    merged.globeScale = coerceNumber(merged.globeScale, 1.0, 0.25, 4.0);
    merged.showCameraOutline = Boolean(merged.showCameraOutline);
    merged.cameraOutlineWidth = coerceNumber(merged.cameraOutlineWidth, 0.02, 0.001, 0.2);
    merged.cameraOutlineRadiusFactor = coerceNumber(merged.cameraOutlineRadiusFactor, 1.0, 0.5, 2.0);

    merged.autoRotate = Boolean(merged.autoRotate);
    merged.autoRotateSpeed = coerceNumber(merged.autoRotateSpeed, 1.0, 0, 5);
    merged.inertia = Boolean(merged.inertia);
    merged.inertiaFriction = coerceNumber(merged.inertiaFriction, 0.95, 0.8, 0.999);
    merged.lockRotationX = Boolean(merged.lockRotationX);
    merged.rotationX = coerceNumber(merged.rotationX, 0, -Math.PI * 0.45, Math.PI * 0.45);
    merged.rotationY = coerceNumber(merged.rotationY, 0, -Math.PI * 100, Math.PI * 100);

    merged.dirLightPos = coerceVector3(merged.dirLightPos, DEFAULT_GLOBE_CONFIG.dirLightPos);
    merged.rimLightPos = coerceVector3(merged.rimLightPos, DEFAULT_GLOBE_CONFIG.rimLightPos);

    return merged;
}

function coerceQualityPreset(value) {
    return value === 'low' || value === 'medium' || value === 'high'
        ? value
        : DEFAULT_GLOBE_CONFIG.qualityPreset;
}

export function toSerializableGlobeConfig(settings) {
    return {
        schemaVersion: GLOBE_CONFIG_SCHEMA_VERSION,
        settings: migrateGlobeConfig(settings)
    };
}

function coerceColor(value, fallback) {
    if (typeof value !== 'string') return fallback;
    const normalized = value.trim();
    return HEX_COLOR_REGEX.test(normalized) ? normalized.toLowerCase() : fallback;
}

function coerceNumber(value, fallback, min, max) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return fallback;
    return Math.max(min, Math.min(max, parsed));
}

function coerceVector3(value, fallback) {
    const source = value && typeof value === 'object' ? value : fallback;
    return {
        x: coerceNumber(source.x, fallback.x, -1000, 1000),
        y: coerceNumber(source.y, fallback.y, -1000, 1000),
        z: coerceNumber(source.z, fallback.z, -1000, 1000)
    };
}
