# Graph Report - vanta  (2026-08-15)

## Corpus Check
- 33 files · ~16,501 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 140 nodes · 207 edges · 12 communities (10 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Core NPM Dependencies
- ScrollStage.jsx
- Build Scripts & Dev Config
- App.jsx
- CarPlaceholder.jsx
- ConfiguratorUI.jsx
- Navigation.jsx
- Hotspots.jsx
- rules/graphify.md
- workflows/graphify.md

## God Nodes (most connected - your core abstractions)
1. `CarPlaceholder()` - 7 edges
2. `Navigation()` - 6 edges
3. `CameraController()` - 6 edges
4. `getAudioContext()` - 6 edges
5. `MagneticButton()` - 5 edges
6. `getConfigOption()` - 5 edges
7. `toggleSound()` - 5 edges
8. `playClick()` - 5 edges
9. `scripts` - 4 edges
10. `playModeSwitch()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `CarPlaceholder()` --calls--> `getConfigOption()`  [EXTRACTED]
  src/components/three/CarPlaceholder.jsx → src/config/configData.js
- `ConfiguratorUI()` --calls--> `getConfigOption()`  [EXTRACTED]
  src/components/ConfiguratorUI.jsx → src/config/configData.js
- `Navigation()` --calls--> `isSoundEnabled()`  [EXTRACTED]
  src/components/Navigation.jsx → src/utils/audio.js
- `Navigation()` --calls--> `playClick()`  [EXTRACTED]
  src/components/Navigation.jsx → src/utils/audio.js
- `Navigation()` --calls--> `playModeSwitch()`  [EXTRACTED]
  src/components/Navigation.jsx → src/utils/audio.js

## Import Cycles
- None detected.

## Communities (12 total, 2 thin omitted)

### Community 0 - "Core NPM Dependencies"
Cohesion: 0.09
Nodes (23): framer-motion, gsap, lenis, dependencies, framer-motion, gsap, lenis, react (+15 more)

### Community 1 - "ScrollStage.jsx"
Cohesion: 0.15
Nodes (13): ScrollStage(), CameraController(), cartesianToSpherical(), interpolateKeyframes(), KEYFRAMES, lookSpline, posSpline, sphericalToCartesian() (+5 more)

### Community 2 - "Build Scripts & Dev Config"
Cohesion: 0.12
Nodes (15): devDependencies, typescript, vite, @vitejs/plugin-react, name, private, scripts, build (+7 more)

### Community 3 - "App.jsx"
Cohesion: 0.09
Nodes (19): App(), CustomCursor(), InfoPanel(), LoadingScreen(), STATUSES, MagneticButton(), ScrollProgress(), SECTIONS (+11 more)

### Community 4 - "CarPlaceholder.jsx"
Cohesion: 0.27
Nodes (8): AeroLines(), createFlowCurve(), LOCAL_FLOW_PATHS, CarPlaceholder(), getExplodeAmount(), getTargetVehicleRotation(), lerpMaterialColor(), _tmpColor

### Community 6 - "ConfiguratorUI.jsx"
Cohesion: 0.31
Nodes (8): CATEGORIES, ConfiguratorUI(), CONFIG_CAMERA_HINTS, DEFAULT_CONFIG, EXTERIOR_COLORS, getConfigOption(), INTERIOR_TRIMS, WHEEL_STYLES

### Community 8 - "Navigation.jsx"
Cohesion: 0.44
Nodes (9): NAV_ITEMS, Navigation(), getAudioContext(), isSoundEnabled(), playClick(), playHeadlightIgnition(), playModeSwitch(), playPaintSweep() (+1 more)

### Community 14 - "Hotspots.jsx"
Cohesion: 0.40
Nodes (3): InspectOverlay(), HOTSPOT_DATA, Hotspots()

## Knowledge Gaps
- **36 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+31 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Core NPM Dependencies` to `Build Scripts & Dev Config`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Why does `Navigation()` connect `Navigation.jsx` to `App.jsx`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _36 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Core NPM Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._
- **Should `ScrollStage.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1471861471861472 - nodes in this community are weakly interconnected._
- **Should `Build Scripts & Dev Config` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._