/**
 * Creates an isolated rotation controller for one globe instance.
 */
export function createRotationController(object3D, targetElement, initialSettings = {}) {
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let velocityX = 0;
    let velocityY = 0;
    let activePointerId = null;

    const settings = {
        autoRotate: false,
        autoRotateSpeed: 1.0,
        inertia: true,
        inertiaFriction: 0.95,
        lockRotationX: false,
        ...initialSettings
    };

    // About +/-80 degrees for natural tilt limits.
    const minRotationX = -Math.PI * 0.45;
    const maxRotationX = Math.PI * 0.45;

    targetElement.style.touchAction = 'none';
    targetElement.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);

    return {
        update,
        setSettings,
        destroy
    };

    function onPointerDown(e) {
        if (activePointerId !== null && activePointerId !== e.pointerId) return;
        activePointerId = e.pointerId;
        isDragging = true;
        prevX = e.clientX;
        prevY = e.clientY;
        velocityX = 0;
        velocityY = 0;
    }

    function onPointerMove(e) {
        if (activePointerId !== null && e.pointerId !== activePointerId) return;
        if (!isDragging) return;
        const dx = e.clientX - prevX;
        const dy = e.clientY - prevY;
        prevX = e.clientX;
        prevY = e.clientY;

        velocityX = dx * 0.005;
        velocityY = dy * 0.005;

        applyRotation(velocityX, velocityY);
    }

    function onPointerUp(e) {
        if (activePointerId !== null && e.pointerId !== activePointerId) return;
        isDragging = false;
        activePointerId = null;
    }

    function applyRotation(dx, dy) {
        object3D.rotation.y += dx;
        if (!settings.lockRotationX) {
            const newX = object3D.rotation.x + dy;
            object3D.rotation.x = Math.max(minRotationX, Math.min(maxRotationX, newX));
        }
    }

    function update() {
        if (isDragging) return;

        if (settings.autoRotate) {
            object3D.rotation.y += settings.autoRotateSpeed * 0.005;
        }

        if (settings.inertia && (Math.abs(velocityX) > 0.0001 || Math.abs(velocityY) > 0.0001)) {
            applyRotation(velocityX, 0);
            velocityX *= settings.inertiaFriction;
            velocityY *= settings.inertiaFriction;
        }
    }

    function setSettings(nextSettings) {
        Object.assign(settings, nextSettings);
    }

    function destroy() {
        targetElement.removeEventListener('pointerdown', onPointerDown);
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
        window.removeEventListener('pointercancel', onPointerUp);
    }
}
