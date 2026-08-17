# Graph Report - c:\Users\dell\OneDrive\Desktop\vanta  (2026-08-17)

## Corpus Check
- Corpus is ~16,588 words - fits in a single context window. You may not need a graph.

## Summary
- 134 nodes · 203 edges · 15 communities (11 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Package Dependencies
- Three.js Scenes
- Package Config
- App Sections
- Navigation and Audio
- Three.js Car Simulation
- Configurator UI and Data
- Configurator Sections
- Hotspots and Overlays
- Loading Screen
- Scroll Progress
- Interior Section
- Performance Section

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

## Communities (15 total, 4 thin omitted)

### Community 0 - "Package Dependencies"
Cohesion: 0.09
Nodes (23): framer-motion, gsap, lenis, dependencies, framer-motion, gsap, lenis, react (+15 more)

### Community 1 - "Three.js Scenes"
Cohesion: 0.17
Nodes (11): ScrollStage(), CameraController(), cartesianToSpherical(), interpolateKeyframes(), KEYFRAMES, sphericalToCartesian(), GroundPlane(), Particles() (+3 more)

### Community 2 - "Package Config"
Cohesion: 0.12
Nodes (15): devDependencies, typescript, vite, @vitejs/plugin-react, name, private, scripts, build (+7 more)

### Community 3 - "App Sections"
Cohesion: 0.21
Nodes (7): App(), CustomCursor(), InfoPanel(), AeroSection(), MachineSection(), FEATURES, TechnologySection()

### Community 4 - "Navigation and Audio"
Cohesion: 0.44
Nodes (9): NAV_ITEMS, Navigation(), getAudioContext(), isSoundEnabled(), playClick(), playHeadlightIgnition(), playModeSwitch(), playPaintSweep() (+1 more)

### Community 5 - "Three.js Car Simulation"
Cohesion: 0.27
Nodes (8): AeroLines(), createFlowCurve(), LOCAL_FLOW_PATHS, CarPlaceholder(), getExplodeAmount(), getTargetVehicleRotation(), lerpMaterialColor(), _tmpColor

### Community 6 - "Configurator UI and Data"
Cohesion: 0.31
Nodes (8): CATEGORIES, ConfiguratorUI(), CONFIG_CAMERA_HINTS, DEFAULT_CONFIG, EXTERIOR_COLORS, getConfigOption(), INTERIOR_TRIMS, WHEEL_STYLES

### Community 7 - "Configurator Sections"
Cohesion: 0.36
Nodes (4): MagneticButton(), ConfiguratorSection(), CTASection(), HeroSection()

### Community 8 - "Hotspots and Overlays"
Cohesion: 0.40
Nodes (3): InspectOverlay(), HOTSPOT_DATA, Hotspots()

## Knowledge Gaps
- **32 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+27 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Package Dependencies` to `Package Config`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Why does `Navigation()` connect `Navigation and Audio` to `App Sections`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _32 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Package Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._
- **Should `Package Config` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._