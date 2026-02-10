import * as THREE from 'three';
import { latLonToVector3 } from './geometry.js';

/**
 * Draws lat-lon lines (grid) on a sphere.
 * Grid is rendered with renderOrder = 2, above the globe but below countries.
 * Perfect 360° distribution for meridians.
 */
export function addLatLonGrid(parent, radius, latStep = 20, lonStep = 20, segmentSize = 1, color = '#ffffff') {
    for (let lat = -90 + latStep; lat < 90; lat += latStep) {
        const points = [];
        for (let lon = -180; lon <= 180; lon += segmentSize) {
            points.push(latLonToVector3(lat, lon, radius));
        }
        const geo = new THREE.BufferGeometry().setFromPoints(points);
        const mat = new THREE.LineBasicMaterial({
            color,
            transparent: true,
            opacity: 0.35
        });
        const line = new THREE.Line(geo, mat);
        line.renderOrder = 2;
        parent.add(line);
    }

    for (let lon = -180; lon < 180; lon += lonStep) {
        const points = [];
        for (let lat = -90; lat <= 90; lat += segmentSize) {
            points.push(latLonToVector3(lat, lon, radius));
        }
        const geo = new THREE.BufferGeometry().setFromPoints(points);
        const mat = new THREE.LineBasicMaterial({
            color,
            transparent: true,
            opacity: 0.35
        });
        const line = new THREE.Line(geo, mat);
        line.renderOrder = 2;
        parent.add(line);
    }
}
