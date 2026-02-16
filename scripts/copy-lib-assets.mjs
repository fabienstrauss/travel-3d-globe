import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const projectRoot = process.cwd();
const srcGeoJsonDir = resolve(projectRoot, 'src/assets/geojson');
const distGeoJsonDir = resolve(projectRoot, 'dist-lib/geojson');

if (!existsSync(srcGeoJsonDir)) {
    throw new Error(`Missing source GeoJSON directory: ${srcGeoJsonDir}`);
}

mkdirSync(distGeoJsonDir, { recursive: true });
cpSync(srcGeoJsonDir, distGeoJsonDir, { recursive: true, force: true });
