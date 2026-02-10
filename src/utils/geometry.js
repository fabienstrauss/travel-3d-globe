import * as THREE from 'three';
import Delaunator from 'delaunator';

/**
 * Convert lat/lon on a sphere to 3D coordinates.
 */
export function latLonToVector3(lat, lon, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);

    const x = -radius * Math.sin(phi) * Math.cos(theta);
    const z =  radius * Math.sin(phi) * Math.sin(theta);
    const y =  radius * Math.cos(phi);

    return new THREE.Vector3(x, y, z);
}

/**
 * Subdivide an edge [A,B] for smoother arcs.
 */
export function subdivideEdgeLinear(A, B, steps = 5) {
    const result = [];
    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const lon = A[0] + t * (B[0] - A[0]);
        const lat = A[1] + t * (B[1] - A[1]);
        result.push([lon, lat]);
    }
    return result;
}

/**
 * Convert 3D coordinates on a sphere back to lat/lon.
 */
export function vector3ToLatLon(vector) {
    const radius = vector.length();
    const phi = Math.acos(vector.y / radius);
    const theta = Math.atan2(vector.z, -vector.x);

    const lat = 90 - (phi * 180 / Math.PI);
    const lon = (theta * 180 / Math.PI) - 180;

    // Normalize lon to -180 to 180
    let normalizedLon = lon;
    while (normalizedLon <= -180) normalizedLon += 360;
    while (normalizedLon > 180) normalizedLon -= 360;

    return { lat, lon: normalizedLon };
}

/**
 * Point-in-polygon test using ray casting algorithm
 */
export function isPointInPolygon(point, polygon) {
    const [x, y] = point;
    let inside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const [xi, yi] = polygon[i];
        const [xj, yj] = polygon[j];

        const intersect = ((yi > y) !== (yj > y)) &&
            (x < (xj - xi) * (y - yi) / (yj - yi) + xi);

        if (intersect) inside = !inside;
    }

    return inside;
}

/**
 * Create a 3D geometry (earcut-based) for a polygon ring on a sphere.
 * Uses aggressive edge densification PLUS interior vertices to eliminate all gaps.
 * This is the complete solution for proper spherical polygon filling.
 */
export function createSphericalPolygonGeometryAdvanced(ring, radius, settings = {}) {
    let avgEdgeLen = 0;
    for (let i = 0; i < ring.length - 1; i++) {
        const [lon1, lat1] = ring[i];
        const [lon2, lat2] = ring[i + 1];
        avgEdgeLen += Math.sqrt((lon2-lon1)**2 + (lat2-lat1)**2);
    }
    avgEdgeLen /= ring.length;

    const densifiedRing = [];
    for (let i = 0; i < ring.length - 1; i++) {
        const [lon1, lat1] = ring[i];
        const [lon2, lat2] = ring[i + 1];
        const edgeLen = Math.sqrt((lon2-lon1)**2 + (lat2-lat1)**2);

        let steps = 1;
        if (avgEdgeLen > 0.5) {
            steps = Math.max(1, Math.ceil(edgeLen / 2.0));
        }

        if (steps > 1) {
            const segment = subdivideEdgeLinear(ring[i], ring[i + 1], steps);
            densifiedRing.push(...segment.slice(0, -1));
        } else {
            densifiedRing.push(ring[i]);
        }
    }
    densifiedRing.push(ring[ring.length - 1]);

    let minLon = Infinity, maxLon = -Infinity;
    let minLat = Infinity, maxLat = -Infinity;

    for (const [lon, lat] of densifiedRing) {
        minLon = Math.min(minLon, lon);
        maxLon = Math.max(maxLon, lon);
        minLat = Math.min(minLat, lat);
        maxLat = Math.max(maxLat, lat);
    }

    const width = maxLon - minLon;
    const height = maxLat - minLat;
    const area = width * height;

    // PERFORMANCE OPTIMIZED: Balance between quality and speed
    // Delaunator creates better triangles, so we can use sparser grids than before
    let gridSpacing;
    if (area > 1000) {
        gridSpacing = 1.5;
    } else if (area > 500) {
        gridSpacing = 2.0;
    } else if (area > 100) {
        gridSpacing = 2.5;
    } else if (area > 20) {
        gridSpacing = 3.5;
    } else {
        gridSpacing = 5.0;
    }

    const fillDetail = Number.isFinite(settings.countryFillDetail) ? settings.countryFillDetail : 1.0;
    gridSpacing *= fillDetail;

    const interiorPoints = [];

    if (width > gridSpacing && height > gridSpacing) {
        for (let lon = minLon + gridSpacing/2; lon < maxLon; lon += gridSpacing) {
            for (let lat = minLat + gridSpacing/2; lat < maxLat; lat += gridSpacing) {
                if (isPointInPolygon([lon, lat], ring)) {
                    interiorPoints.push([lon, lat]);
                }
            }
        }
    }

    const allPoints = [...densifiedRing, ...interiorPoints];

    const vertices3D = allPoints.map(([lon, lat]) => latLonToVector3(lat, lon, radius));

    let centroidLon = 0, centroidLat = 0;
    for (const [lon, lat] of allPoints) {
        centroidLon += lon;
        centroidLat += lat;
    }
    centroidLon /= allPoints.length;
    centroidLat /= allPoints.length;

    const vertices2D = allPoints.map(([lon, lat]) => [
        lon - centroidLon,
        lat - centroidLat
    ]);

    const flatCoords = [];
    for (const [x, y] of vertices2D) {
        flatCoords.push(x, y);
    }

    const delaunay = Delaunator.from(vertices2D);

    if (!delaunay || !delaunay.triangles || delaunay.triangles.length === 0) {
        console.warn('Delaunator triangulation failed for polygon');
        return new THREE.BufferGeometry();
    }

    const validIndices = [];
    for (let i = 0; i < delaunay.triangles.length; i += 3) {
        const t0 = delaunay.triangles[i];
        const t1 = delaunay.triangles[i + 1];
        const t2 = delaunay.triangles[i + 2];

        const centroidX = (vertices2D[t0][0] + vertices2D[t1][0] + vertices2D[t2][0]) / 3;
        const centroidY = (vertices2D[t0][1] + vertices2D[t1][1] + vertices2D[t2][1]) / 3;

        const absX = centroidX + centroidLon;
        const absY = centroidY + centroidLat;

        if (isPointInPolygon([absX, absY], ring)) {
            validIndices.push(t0, t1, t2);
        }
    }

    if (validIndices.length === 0) {
        console.warn('No valid triangles after filtering');
        return new THREE.BufferGeometry();
    }

    const indices = validIndices;

    const geom = new THREE.BufferGeometry();
    const positionArray = new Float32Array(vertices3D.length * 3);
    for (let i = 0; i < vertices3D.length; i++) {
        positionArray[i * 3 + 0] = vertices3D[i].x;
        positionArray[i * 3 + 1] = vertices3D[i].y;
        positionArray[i * 3 + 2] = vertices3D[i].z;
    }
    geom.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
    geom.setIndex(new THREE.BufferAttribute(new Uint32Array(indices), 1));
    geom.computeVertexNormals();

    return geom;
}
