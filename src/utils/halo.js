import * as THREE from 'three';

/**
 * Creates a halo mesh that replicates the snippet’s glow effect.
 *
 * @param {number} radius - The base radius (same as your globe’s radius).
 * @param {number} [scale=1.15] - Scale factor to make the halo bigger than the globe.
 * @param {THREE.Color|string|number} [glowColor=0x1c2db2] - The glow color (#1c2db2 in snippet).
 * @param {number} [segments=45] - Sphere segments.
 * @returns {THREE.Mesh} A mesh with the halo shader, scaled & rotated like the snippet.
 */
export function createSnippetHalo(
    radius,
    scale = 1.15,
    glowColor = 0x1c2db2,
    segments = 45
) {
    const sphereGeo = new THREE.SphereGeometry(radius, segments, segments);

    const haloMaterial = new THREE.ShaderMaterial({
        uniforms: {
            c: { type: 'f', value: 0.7 },       // snippet had c = .7
            p: { type: 'f', value: 15 },        // snippet had p = 15
            glowColor: { type: 'c', value: new THREE.Color(glowColor) },
            viewVector: { type: 'v3', value: new THREE.Vector3(0, 0, 220) }
        },
        vertexShader: `
      #define GLSLIFY 1
      uniform vec3 viewVector;
      uniform float c;
      uniform float p;
      varying float intensity;
      varying float intensityA;
      void main() {
        // replicate snippet logic
        vec3 vNormal = normalize(normalMatrix * normal);
        vec3 vNormel = normalize(normalMatrix * viewVector);
        float d = dot(vNormal, vNormel);
        // c - d, p => snippet used pow(c - d, p)
        intensity = pow(c - d, p);
        // snippet also used intensityA = pow(0.63 - d, p)
        intensityA = pow(0.63 - d, p);

        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
        fragmentShader: `
      #define GLSLIFY 1
      uniform vec3 glowColor;
      varying float intensity;
      varying float intensityA;
      void main() {
        // snippet: gl_FragColor = vec4( glowColor * intensity, 1.0 * intensityA );
        gl_FragColor = vec4(glowColor * intensity, intensityA);
      }
    `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        dithering: true
    });

    const haloMesh = new THREE.Mesh(sphereGeo, haloMaterial);

    haloMesh.scale.multiplyScalar(scale);

    haloMesh.rotation.x = 0.03 * Math.PI;
    haloMesh.rotation.y = 0.03 * Math.PI;

    haloMesh.renderOrder = 3;

    return haloMesh;
}

/**
 * Updates halo parameters.
 */
export function updateSnippetHalo(mesh, settings) {
    if (!mesh || !mesh.material || !mesh.material.uniforms) return;
    mesh.visible = settings.showHalo;
    mesh.material.uniforms.glowColor.value.setStyle(settings.haloColor);
    mesh.material.uniforms.c.value = settings.haloIntensity;
    mesh.material.uniforms.p.value = settings.haloPower;
    mesh.material.opacity = settings.globalOpacity !== undefined ? settings.globalOpacity : 1.0;
}
