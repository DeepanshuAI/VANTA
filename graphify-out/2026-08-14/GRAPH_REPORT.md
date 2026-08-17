# Graph Report - vanta  (2026-08-14)

## Corpus Check
- 30 files · ~12,306 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 120 nodes · 159 edges · 18 communities (10 shown, 8 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Core NPM Dependencies
- ScrollStage.jsx
- Build Scripts & Dev Config
- App.jsx
- Interactive Buttons & Action Sections
- Aerodynamics Visualizer
- CameraController.jsx
- Loading Screen Sequence
- Fixed Navigation System
- Scroll Progress Tracker
- Interior Sanctuary Section
- Performance Metrics Section
- Hotspots.jsx
- TechnologySection.jsx
- rules/graphify.md
- workflows/graphify.md

## God Nodes (most connected - your core abstractions)
1. `CameraController()` - 6 edges
2. `CarPlaceholder()` - 5 edges
3. `scripts` - 4 edges
4. `MagneticButton()` - 4 edges
5. `AeroLines()` - 3 edges
6. `useCarMaterials()` - 3 edges
7. `GroundPlane()` - 3 edges
8. `StudioLighting()` - 3 edges
9. `Particles()` - 3 edges
10. `@vitejs/plugin-react` - 2 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (18 total, 8 thin omitted)

### Community 0 - "Core NPM Dependencies"
Cohesion: 0.09
Nodes (23): framer-motion, gsap, lenis, dependencies, framer-motion, gsap, lenis, react (+15 more)

### Community 1 - "ScrollStage.jsx"
Cohesion: 0.18
Nodes (10): ScrollStage(), CarPlaceholder(), getExplodeAmount(), useCarMaterials(), Wheel(), GroundPlane(), Particles(), StudioLighting() (+2 more)

### Community 2 - "Build Scripts & Dev Config"
Cohesion: 0.12
Nodes (15): devDependencies, typescript, vite, @vitejs/plugin-react, name, private, scripts, build (+7 more)

### Community 3 - "App.jsx"
Cohesion: 0.27
Nodes (5): App(), CustomCursor(), InfoPanel(), AeroSection(), MachineSection()

### Community 4 - "Interactive Buttons & Action Sections"
Cohesion: 0.36
Nodes (4): MagneticButton(), ConfiguratorSection(), CTASection(), HeroSection()

### Community 5 - "Aerodynamics Visualizer"
Cohesion: 0.50
Nodes (3): AeroLines(), createFlowCurve(), FLOW_PATHS

### Community 6 - "CameraController.jsx"
Cohesion: 0.43
Nodes (6): CameraController(), cartesianToSpherical(), interpolateKeyframes(), KEYFRAMES, keyframeVecs, sphericalToCartesian()

### Community 14 - "Hotspots.jsx"
Cohesion: 0.40
Nodes (3): InspectOverlay(), HOTSPOT_DATA, Hotspots()

## Knowledge Gaps
- **33 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+28 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Core NPM Dependencies` to `Build Scripts & Dev Config`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **Why does `CameraController()` connect `CameraController.jsx` to `ScrollStage.jsx`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _33 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Core NPM Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._
- **Should `Build Scripts & Dev Config` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._