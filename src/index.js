/**
 * Package entrypoint for the embeddable globe component and config helpers.
 */
export { createGlobe } from './core/globeComponent.js';
export {
    GLOBE_CONFIG_SCHEMA_VERSION,
    DEFAULT_GLOBE_CONFIG,
    getGeoJsonUrlForResolution,
    migrateGlobeConfig,
    toSerializableGlobeConfig
} from './config/globeConfig.js';
