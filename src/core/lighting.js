import * as THREE from 'three';

/**
 * Creates an isolated lighting controller bound to one scene.
 */
export function createLightingController(scene, initialSettings) {
    let ambientLight = null;
    let dirLight = null;
    let rimLight = null;
    let fillLight = null;

    init(initialSettings);

    return {
        update,
        destroy
    };

    function init(settings) {
        clearLights();

        ambientLight = new THREE.AmbientLight(settings.ambientColor, settings.ambientIntensity);
        scene.add(ambientLight);

        dirLight = new THREE.DirectionalLight(settings.dirLightColor, settings.dirLightIntensity);
        dirLight.position.set(settings.dirLightPos.x, settings.dirLightPos.y, settings.dirLightPos.z);
        scene.add(dirLight);

        rimLight = new THREE.PointLight(settings.rimLightColor, settings.rimLightIntensity, 10);
        rimLight.position.set(settings.rimLightPos.x, settings.rimLightPos.y, settings.rimLightPos.z);
        scene.add(rimLight);

        fillLight = new THREE.HemisphereLight(
            settings.fillLightSkyColor,
            settings.fillLightGroundColor,
            settings.fillLightIntensity
        );
        scene.add(fillLight);

        update(settings);
    }

    function update(settings) {
        if (ambientLight) {
            ambientLight.color.setStyle(settings.ambientColor);
            ambientLight.intensity = settings.ambientIntensity;
            ambientLight.visible = settings.ambientEnabled;
        }
        if (dirLight) {
            dirLight.color.setStyle(settings.dirLightColor);
            dirLight.intensity = settings.dirLightIntensity;
            dirLight.position.set(settings.dirLightPos.x, settings.dirLightPos.y, settings.dirLightPos.z);
            dirLight.visible = settings.dirLightEnabled;
        }
        if (rimLight) {
            rimLight.color.setStyle(settings.rimLightColor);
            rimLight.intensity = settings.rimLightIntensity;
            rimLight.position.set(settings.rimLightPos.x, settings.rimLightPos.y, settings.rimLightPos.z);
            rimLight.visible = settings.rimLightEnabled;
        }
        if (fillLight) {
            fillLight.color.setStyle(settings.fillLightSkyColor);
            fillLight.groundColor.setStyle(settings.fillLightGroundColor);
            fillLight.intensity = settings.fillLightIntensity;
            fillLight.visible = settings.fillLightEnabled;
        }
    }

    function clearLights() {
        if (ambientLight) scene.remove(ambientLight);
        if (dirLight) scene.remove(dirLight);
        if (rimLight) scene.remove(rimLight);
        if (fillLight) scene.remove(fillLight);
    }

    function destroy() {
        clearLights();
        ambientLight = null;
        dirLight = null;
        rimLight = null;
        fillLight = null;
    }
}
