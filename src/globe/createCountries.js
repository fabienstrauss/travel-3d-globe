import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {
    createSphericalPolygonGeometryAdvanced,
    latLonToVector3,
    subdivideEdgeLinear
} from '../utils/geometry.js';

/**
 * Loads the GeoJSON, highlights certain ISO codes with highlightColor, the rest with defaultColor,
 * and outlines all countries with outlineColor.
 * Uses ConicPolygonGeometry for proper spherical polygon rendering without gaps.
 */
export async function loadCountries(globeGroup, geojsonUrl, highlightCodes = [], debugMode = false, settings = {}) {
    // Default colors and performance settings
    const highlightColor = settings.highlightColor || '#ffffff';
    const defaultColor = settings.defaultColor || '#000000';
    const outlineColor = settings.outlineColor || '#ffffff';
    const globalOpacity = settings.globalOpacity !== undefined ? settings.globalOpacity : 1.0;
    const progressive = settings.progressiveLoading !== undefined ? settings.progressiveLoading : true;
    const batchSize = settings.batchSize || 20;

    const startTime = performance.now();
    console.log(`Loading countries from: ${geojsonUrl} (Progressive: ${progressive}, Batch: ${batchSize})`);

    const res = await fetch(geojsonUrl);
    const data = await res.json();

    const loadTime = performance.now() - startTime;
    console.log(`Loaded ${data.features.length} countries in ${loadTime.toFixed(0)}ms`);

    const highlightGeometries = [];
    const defaultGeometries = [];
    const outlineGeometries = [];

    let successCount = 0;
    let failCount = 0;

    // Helper to process a batch of features
    const processBatch = (startIdx) => {
        const endIdx = Math.min(startIdx + batchSize, data.features.length);
        
        for (let i = startIdx; i < endIdx; i++) {
            const feature = data.features[i];
            const p = feature.properties;
            
            const isHighlighted = highlightCodes.some(code => 
                p.ADM0_A3 === code || 
                p.ISO_A3 === code || 
                p.GU_A3 === code || 
                p.SOV_A3 === code
            );

            try {
                const radius = settings.countryRadius || 1.01;
                const geometries = createCountryGeometries(feature, isHighlighted, radius, settings);
                if (geometries.fill) {
                    if (isHighlighted) {
                        highlightGeometries.push(geometries.fill);
                    } else {
                        defaultGeometries.push(geometries.fill);
                    }
                }
                if (geometries.outlines) {
                    outlineGeometries.push(...geometries.outlines);
                }
                successCount++;
            } catch (error) {
                console.error(`Failed to create country ${p.ADM0_A3 || p.NAME}:`, error);
                failCount++;
            }
        }

        if (endIdx < data.features.length) {
            // Schedule next batch
            if (progressive) {
                return new Promise((resolve) => {
                    setTimeout(() => resolve(processBatch(endIdx)), 0);
                });
            }
            return processBatch(endIdx);
        } else {
            // All done, finalize rendering
            finalizeRendering();
            return data;
        }
    };

    const finalizeRendering = () => {
        // Merge and add meshes to globeGroup
        if (highlightGeometries.length > 0) {
            const mergedHighlight = mergeGeometries(highlightGeometries, false);
            const highlightOpacity = settings.countryOpacity !== undefined ? settings.countryOpacity : 1.0;
            const effectiveHighlightOpacity = Math.max(0, Math.min(1, highlightOpacity * globalOpacity));
            const mat = new THREE.MeshBasicMaterial({
                color: highlightColor,
                side: THREE.DoubleSide,
                transparent: effectiveHighlightOpacity < 1.0,
                opacity: effectiveHighlightOpacity
            });
            const mesh = new THREE.Mesh(mergedHighlight, mat);
            mesh.renderOrder = 3;
            globeGroup.add(mesh);
        }

        if (defaultGeometries.length > 0) {
            const mergedDefault = mergeGeometries(defaultGeometries, false);
            const defaultOpacity = settings.countryOpacity !== undefined ? settings.countryOpacity : 1.0;
            const effectiveDefaultOpacity = Math.max(0, Math.min(1, defaultOpacity * globalOpacity));
            const mat = new THREE.MeshBasicMaterial({
                color: defaultColor,
                side: THREE.DoubleSide,
                transparent: effectiveDefaultOpacity < 1.0,
                opacity: effectiveDefaultOpacity
            });
            const mesh = new THREE.Mesh(mergedDefault, mat);
            mesh.renderOrder = 3;
            globeGroup.add(mesh);
        }

        outlineGeometries.forEach(outline => {
            if (outline.material) {
                outline.material.color.setStyle(outlineColor);
                const outlineOpacity = settings.outlineOpacity !== undefined ? settings.outlineOpacity : 1.0;
                const effectiveOutlineOpacity = Math.max(0, Math.min(1, outlineOpacity * globalOpacity));
                outline.material.opacity = effectiveOutlineOpacity;
                outline.material.transparent = effectiveOutlineOpacity < 1.0;
            }
            globeGroup.add(outline);
        });

        const totalTime = performance.now() - startTime;
        console.log(`Total render time: ${totalTime.toFixed(0)}ms (${successCount} success, ${failCount} failed)`);
    };

    return processBatch(0);
}

/**
 * Creates country geometries (fill and outlines) without adding to scene.
 * Returns geometries for later merging.
 * PERFORMANCE: This allows us to merge all countries of the same color into one mesh.
 */
function createCountryGeometries(feature, isHighlighted, radius, settings) {
    const { type, coordinates } = feature.geometry;

    const fillGeometries = [];
    const outlineGeometries = [];

    if (type === 'Polygon') {
        const fillGeom = createPolygonFillGeometry(coordinates[0], radius, settings);
        if (fillGeom) fillGeometries.push(fillGeom);

        const outlines = createPolygonOutlineGeometry(coordinates, radius + 0.002, settings);
        outlineGeometries.push(...outlines);
    } else if (type === 'MultiPolygon') {
        coordinates.forEach((poly) => {
            const fillGeom = createPolygonFillGeometry(poly[0], radius, settings);
            if (fillGeom) fillGeometries.push(fillGeom);

            const outlines = createPolygonOutlineGeometry(poly, radius + 0.002, settings);
            outlineGeometries.push(...outlines);
        });
    }

    // Merge all fill geometries for this country
    const mergedFill = fillGeometries.length > 0 ? mergeGeometries(fillGeometries, false) : null;

    return {
        fill: mergedFill,
        outlines: outlineGeometries
    };
}

// ========== FILL ==========

function createPolygonFillGeometry(ring, radius, settings) {
    try {
        return createSphericalPolygonGeometryAdvanced(ring, radius, settings);
    } catch (error) {
        console.error('Failed to create polygon geometry:', error);
        return null;
    }
}

// ========== OUTLINE ==========

function createPolygonOutlineGeometry(coords, radius, settings) {
    const outlines = [];

    // For either 'Polygon' or 'MultiPolygon'
    // coords is the full polygon coordinates array (exterior + holes)
    coords.forEach((ring) => {
        // Calculate edge lengths to determine optimal subdivision
        let totalLength = 0;
        for (let i = 0; i < ring.length - 1; i++) {
            const [lon1, lat1] = ring[i];
            const [lon2, lat2] = ring[i + 1];
            const dLon = lon2 - lon1;
            const dLat = lat2 - lat1;
            totalLength += Math.sqrt(dLon * dLon + dLat * dLat);
        }
        const avgLength = totalLength / (ring.length - 1);

        // PERFORMANCE: Reduced subdivision for faster rendering
        // Outlines don't need as much detail as fills
        const outlineDetail = Number.isFinite(settings.outlineDetail) ? settings.outlineDetail : 1.0;
        const rawSteps = Math.ceil(avgLength / 2.0) * outlineDetail;
        const subdivSteps = Math.max(2, Math.min(12, Math.ceil(rawSteps)));

        // Subdivide each edge for smoother arcs
        const subdivRing = [];
        for (let i = 0; i < ring.length - 1; i++) {
            const segment = subdivideEdgeLinear(ring[i], ring[i + 1], subdivSteps);
            subdivRing.push(...segment.slice(0, -1));
        }
        // Close ring with last edge
        const lastSegment = subdivideEdgeLinear(ring[ring.length - 1], ring[0], subdivSteps);
        subdivRing.push(...lastSegment.slice(0, -1));

        // Convert each subdivided lat-lon to 3D
        // Use radius significantly above filled polygons for clear separation
        const points = subdivRing.map(([lon, lat]) => latLonToVector3(lat, lon, radius));

        // Create a high-quality line with optimal settings
        const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
        const lineMat = new THREE.LineBasicMaterial({
            color: 0xffffff,  // White outlines
            linewidth: 1,
            depthTest: true,
            depthWrite: false  // Don't write to depth buffer for cleaner overlaps
        });
        const line = new THREE.LineLoop(lineGeo, lineMat);
        line.renderOrder = 4; // Render country outlines on top of everything
        outlines.push(line);
    });

    return outlines;
}
