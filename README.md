# Travel3DGlobe

A reusable 3D globe component with a visual config editor that can export/import `globe-config.json`.

## Editor App

Hosted editor (Vercel): `<VERCEL_APP_URL>`

This app lets you tune globe settings visually and export a config JSON for use in your own project.

## Install

From npm:

```bash
npm install <NPM_PACKAGE_NAME>
```

From GitHub:

```bash
npm install github:<GITHUB_USER>/<GITHUB_REPO>#<TAG_OR_BRANCH>
```

## Component Usage

```js
import { createGlobe } from '<NPM_PACKAGE_NAME>';

const globe = await createGlobe({
  container: document.getElementById('globe-root'),
  config: {
    highlightCodes: ['USA', 'CAN', 'MEX']
  }
});

// optional runtime updates
await globe.setConfig({ showGrid: false, haloColor: '#33aaff' });

// optional: export current runtime config object
const cfg = globe.getConfig();

// required on unmount / cleanup
globe.destroy();
```

Required:
- `container`: DOM element where the globe is mounted

Optional:
- `config`: partial globe config (missing fields use defaults)
- `enableDebugPanel`: `true | false` (default `true` in editor host usage)

Notes:
- Globe size follows the container size.
- Use CSS for responsive or fixed dimensions of the container.
- `globeScale` changes globe size inside the canvas, not the canvas size itself.

## Project Structure

- `src/index.js`: package exports
- `src/core/globeComponent.js`: embeddable globe lifecycle/API
- `src/config/globeConfig.js`: config defaults + migration/normalization
- `src/debug/controls.js`: editor GUI
- `src/main.js`: editor/demo app entry

## License

`<LICENSE_TYPE>` (for example `MIT`). See `LICENSE`.

## Contributing

Contributions are welcome via issues and pull requests.
