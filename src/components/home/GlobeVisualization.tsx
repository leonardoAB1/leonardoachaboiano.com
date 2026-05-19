"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type {
  CanvasTexture,
  Material,
  Mesh,
  MeshPhongMaterial,
  Object3D,
  PerspectiveCamera,
  Sprite,
  SpriteMaterial,
  Texture,
  WebGLRenderer,
} from "three";
import { GlobePlaceholder } from "@/components/home/GlobePlaceholder";
import { timelineEntries } from "@/data/timeline";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { GLOBE_TEXTURES } from "@/lib/globe-textures";
import { cn } from "@/lib/utils";

type ThreeNamespace = typeof import("three");

interface CareerArc {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
}

interface GlobeLabelDatum {
  lat: number;
  lng: number;
  label: string;
}

interface GlobeInstance extends Object3D {
  htmlElementsData: (data: GlobeLabelDatum[]) => GlobeInstance;
  htmlElement: (fn: (d: GlobeLabelDatum) => HTMLElement) => GlobeInstance;
  htmlAltitude: (alt: number) => GlobeInstance;
  globeMaterial: () => Material;
  onGlobeReady: (cb: () => void) => void;
}

interface MarkerSprite extends Sprite {
  userData: { baseSize: number };
}

const MATERIAL_TEXTURE_SLOTS = [
  "map",
  "bumpMap",
  "normalMap",
  "specularMap",
  "emissiveMap",
  "alphaMap",
  "aoMap",
  "lightMap",
] as const;

type MaterialTextureSlot = (typeof MATERIAL_TEXTURE_SLOTS)[number];

interface GlobeVisualizationProps {
  activeIndex: number;
  showLabel?: boolean;
}

// Career arcs: unique location transitions in chronological order
const CAREER_ARCS = [
  // Santa Cruz → Kamloops (Rotary Youth Exchange, 2018)
  {
    startLat: -17.7833,
    startLng: -63.1821,
    endLat: 50.6745,
    endLng: -120.3273,
  },
  // Kamloops → Santa Cruz (return from exchange, 2019)
  {
    startLat: 50.6745,
    startLng: -120.3273,
    endLat: -17.7833,
    endLng: -63.1821,
  },
  // Santa Cruz → Stafa (Bolivia to Switzerland, career move 2024)
  { startLat: -17.7833, startLng: -63.1821, endLat: 47.2292, endLng: 8.73 },
  // Stafa → Basel (within Switzerland)
  { startLat: 47.2292, startLng: 8.73, endLat: 47.5596, endLng: 7.5886 },
];


// Arc altitude proportional to the great-circle angle between endpoints.
// Close locations (Stafa→Basel, ~22 km) get a nearly flat arc;
// distant ones (SC→Stafa, ~11 000 km / ~91°) get a moderate rise.
// Formula: sin(angle/2) × 0.4 — naturally scales from 0 to 0.4.
function naturalArcAltitude(d: {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
}): number {
  const r = Math.PI / 180;
  const lat1 = d.startLat * r;
  const lat2 = d.endLat * r;
  const dLng = (d.endLng - d.startLng) * r;
  const cosA =
    Math.sin(lat1) * Math.sin(lat2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.cos(dLng);
  const angle = Math.acos(Math.max(-1, Math.min(1, cosA)));
  // Minimum of 0.015 so very short arcs (Stafa→Basel) stay visible when zoomed in
  return Math.max(0.015, Math.sin(angle / 2) * 0.4);
}

// Camera is at (0, 40, 320) → looks down at angle atan2(40,320) ≈ 7.1° from equator.
// That 7.1° is the latitude that appears at the visual centre when rotation.x = 0.
const CAM_ELEVATION = Math.atan2(40, 320); // ≈ 0.124 rad

// THREE.SphereGeometry UV: phi=π is the +Z front face (U=0.5 = lng 0°, Greenwich).
// Positive rotation.y (CCW from above) brings the -X side into view, lowering visible lng.
// Relationship: visible_lng = -(rotation.y × 180/π), so: rotation.y = -lng_rad.
function targetRotationY(lngDeg: number) {
  return -(lngDeg * Math.PI) / 180;
}

// The camera's visual centre sits at ~7.1°N when rotation.x = 0.
// To bring latitude L to the visual centre: rotation.x = L_rad − CAM_ELEVATION.
// Verified: Basel 47.6°N → +0.706 rad, Santa Cruz −17.8°S → −0.434 rad.
function targetRotationX(latDeg: number) {
  return (latDeg * Math.PI) / 180 - CAM_ELEVATION;
}

// Normalise target to take the shortest arc from current rotation.
function shortestPath(current: number, target: number) {
  let t = target;
  while (t - current > Math.PI) t -= 2 * Math.PI;
  while (t - current < -Math.PI) t += 2 * Math.PI;
  return t;
}

// Convert lat/lng/altitude to Three.js local XYZ within the globe's coordinate space.
// Matches three-globe's internal polar2Cartesian formula exactly (verified from source):
//   theta = (90 - lng) * π/180, NOT the standard (lng + 180) convention.
// Using any other formula shifts dots by ~90° relative to the globe surface.
function latLngToLocal(lat: number, lng: number, alt: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (90 - lng) * (Math.PI / 180);
  const R = 100 * (1 + alt);
  const phiSin = Math.sin(phi);
  return {
    x: R * phiSin * Math.cos(theta),
    y: R * Math.cos(phi),
    z: R * phiSin * Math.sin(theta),
  };
}

// Create a canvas-based radial gradient texture that simulates a glowing light source.
// The gradient has four stops: solid bright core → solid inner → mid glow → transparent edge.
// This gives a "hot core + diffuse halo" look rather than a simple linear fade.
// THREE is passed as a parameter to avoid module-level import (SSR safety).
function makeGlowTexture(
  THREE: ThreeNamespace,
  hexColor: string,
  alpha: number,
  size = 128,
): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("2d canvas context unavailable");
  }
  const c = size / 2;
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const grad = ctx.createRadialGradient(c, c, 0, c, c, c);
  grad.addColorStop(0, `rgba(${r},${g},${b},${alpha})`);
  grad.addColorStop(0.25, `rgba(${r},${g},${b},${alpha * 0.85})`);
  grad.addColorStop(0.6, `rgba(${r},${g},${b},${alpha * 0.3})`);
  grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

function loadTexture(THREE: ThreeNamespace, url: string): Promise<Texture> {
  return new Promise((resolve, reject) => {
    new THREE.TextureLoader().load(url, resolve, undefined, reject);
  });
}

const GLOBE_FADE_EASE = [0.22, 1, 0.36, 1] as const;
const GLOBE_FADE_CSS_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const GLOBE_FADE_DURATION_S = 0.4;
const GLOBE_FADE_DURATION_MS = 400;
const GLOBE_FADE_REDUCED_S = 0.15;
const GLOBE_FADE_REDUCED_MS = 150;

function scheduleReveal(callback: () => void): void {
  requestAnimationFrame(() => {
    requestAnimationFrame(callback);
  });
}

// Build THREE.Sprite objects for each timeline location and add them to the globe.
// Sprites are billboards: they always face the camera regardless of globe rotation,
// so the gradient always reads correctly. depthTest:true ensures the opaque globe
// sphere occludes sprites on the back face (correct visibility without extra logic).
function buildSprites(
  activeIdx: number,
  camZ: number,
  THREE: ThreeNamespace,
  globe: Object3D,
  activeTex: CanvasTexture,
  inactiveTex: CanvasTexture,
): MarkerSprite[] {
  const scale = camZ / 320;
  return timelineEntries.map((entry, i) => {
    const isActive = i === activeIdx;
    const alt = isActive ? 0.025 : 0.01;
    const pos = latLngToLocal(entry.coordinates[0], entry.coordinates[1], alt);
    const mat = new THREE.SpriteMaterial({
      map: isActive ? activeTex : inactiveTex,
      transparent: true,
      depthTest: true,
      depthWrite: false,
    });
    const sprite = new THREE.Sprite(mat) as MarkerSprite;
    sprite.position.set(pos.x, pos.y, pos.z);
    const baseSize = isActive ? 8 : 4;
    sprite.scale.setScalar(baseSize * scale);
    sprite.userData = { baseSize };
    globe.add(sprite);
    return sprite;
  });
}

export function GlobeVisualization({
  activeIndex,
  showLabel = true,
}: GlobeVisualizationProps) {
  const [isReady, setIsReady] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const fadeDuration = prefersReducedMotion
    ? GLOBE_FADE_REDUCED_S
    : GLOBE_FADE_DURATION_S;
  const fadeMsRef = useRef(GLOBE_FADE_DURATION_MS);
  fadeMsRef.current = prefersReducedMotion
    ? GLOBE_FADE_REDUCED_MS
    : GLOBE_FADE_DURATION_MS;
  const containerRef = useRef<HTMLDivElement>(null);

  // Mutable state shared between the two effects via refs (no re-renders needed).
  const globeRef = useRef<GlobeInstance | null>(null);
  const cameraRef = useRef<PerspectiveCamera | null>(null);
  const rendererRef = useRef<WebGLRenderer | null>(null);
  // Stores the THREE module so Effect 1 can call buildSprites without re-importing.
  const threeRef = useRef<ThreeNamespace | null>(null);
  // Sprites rebuilt on activeIndex change; shared textures are allocated once.
  const spritesRef = useRef<MarkerSprite[]>([]);
  const activeMarkerTexRef = useRef<CanvasTexture | null>(null);
  const inactiveMarkerTexRef = useRef<CanvasTexture | null>(null);
  const targetRotXRef = useRef(
    targetRotationX(timelineEntries[activeIndex].coordinates[0]),
  );
  const targetRotYRef = useRef(
    targetRotationY(timelineEntries[activeIndex].coordinates[1]),
  );
  const camPosRef = useRef({ x: 0, y: 40, z: 320 });
  // Populated by the init effect; called by Effect 1 to clear drag momentum
  // before setting a new programmatic target so the two don't fight each other.
  const stopMomentumRef = useRef<() => void>(() => {});
  // Resets the camera back to the Z axis at the current zoom level when a new
  // location is selected, so the zoom-toward-location offset doesn't carry over.
  const resetCamToAxisRef = useRef<() => void>(() => {});
  // Tracks activeIndex for the animation loop (which runs as a closure and
  // can't read the prop directly after it changes).
  const activeIndexRef = useRef(activeIndex);
  const showLabelRef = useRef(showLabel);

  activeIndexRef.current = activeIndex;
  showLabelRef.current = showLabel;

  // ── Effect 1: react to activeIndex changes ───────────────────────────────
  // Separated from the init effect so changes don't re-create the globe.
  useEffect(() => {
    if (
      !globeRef.current ||
      !threeRef.current ||
      !activeMarkerTexRef.current ||
      !inactiveMarkerTexRef.current
    )
      return;

    activeIndexRef.current = activeIndex;
    // Kill any drag momentum so it doesn't fight the programmatic target.
    stopMomentumRef.current();
    // Snap camera target back to Z axis so the zoom-toward-location offset
    // from a previous entry doesn't carry over to the new one.
    resetCamToAxisRef.current();

    const entry = timelineEntries[activeIndex];

    // Set X rotation to bring the target's latitude to the visual centre.
    const rawX = targetRotationX(entry.coordinates[0]);
    targetRotXRef.current = shortestPath(globeRef.current.rotation.x, rawX);
    const raw = targetRotationY(entry.coordinates[1]);

    // Shortest-path normalisation prevents the globe spinning the long way around.
    targetRotYRef.current = shortestPath(globeRef.current.rotation.y, raw);

    // Remove old sprites and dispose their materials.
    // Shared glow textures are NOT disposed here - only on full component cleanup.
    const globe = globeRef.current;
    spritesRef.current.forEach((s) => {
      globe.remove(s);
      (s.material as SpriteMaterial).dispose();
    });
    // Rebuild sprites reusing the pre-built shared textures.
    spritesRef.current = buildSprites(
      activeIndex,
      camPosRef.current.z,
      threeRef.current,
      globeRef.current,
      activeMarkerTexRef.current,
      inactiveMarkerTexRef.current,
    );

    // Swap the HTML label to the new location.
    if (showLabel) {
      globeRef.current.htmlElementsData([
        {
          lat: entry.coordinates[0],
          lng: entry.coordinates[1],
          label: entry.location,
        },
      ]);
    }
  }, [activeIndex, showLabel]);

  // ── Effect 2: initialise Three.js + three-globe (runs once) ─────────────
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;

    // Collect all cleanup callbacks so the return function is comprehensive.
    // Blog recommendation: use a cleanupFns array to prevent GPU memory leaks.
    const cleanupFns: Array<() => void> = [];

    (async () => {
      // Dynamic imports prevent SSR errors (three-globe uses `window` at module level).
      const [ThreeGlobeModule, THREE] = await Promise.all([
        import("three-globe"),
        import("three"),
      ]);

      if (cancelled) return; // component unmounted before imports resolved

      // Store THREE module so Effect 1 can call buildSprites on activeIndex change.
      threeRef.current = THREE;

      const ThreeGlobe = ThreeGlobeModule.default;
      const W = container.offsetWidth;
      const H = container.offsetHeight;

      // ── Renderer ──────────────────────────────────────────────────────────
      // alpha:true lets the canvas be transparent so the page background shows
      // through in both light and dark mode. The container CSS clips it to a
      // circle so there is no visible rectangle.
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(W, H);
      renderer.setClearColor(0x000000, 0); // fully transparent
      const canvas = renderer.domElement;
      canvas.style.opacity = "0";
      canvas.style.pointerEvents = "none";
      container.appendChild(canvas);
      rendererRef.current = renderer;

      // ── Scene ─────────────────────────────────────────────────────────────
      const scene = new THREE.Scene();

      // ── Camera ────────────────────────────────────────────────────────────
      // Offset Y slightly so the view tilts toward the northern hemisphere,
      // matching the mockup perspective.
      const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 2000);
      camera.position.set(0, 40, 320);
      camera.lookAt(0, 0, 0);
      cameraRef.current = camera;
      camPosRef.current = { x: 0, y: 40, z: 320 };

      // ── Lighting ──────────────────────────────────────────────────────────
      // Soft neutral sky so the Blue Marble texture reads in its natural colours.
      // Sky=pale blue (matches real sky light), ground=deep navy (ocean ambient).
      scene.add(new THREE.HemisphereLight(0xaac4dd, 0x223344, 2.2));
      // Warm-white "sun" from upper-left: kept weak so it contributes direction
      // without creating a harsh terminator line.
      const sun = new THREE.DirectionalLight(0xfff5e8, 0.6);
      sun.position.set(-2, 1.5, 1);
      scene.add(sun);

      // ── Three-Globe ───────────────────────────────────────────────────────
      const initialActiveIndex = activeIndexRef.current;
      const initialShowLabel = showLabelRef.current;
      const entry = timelineEntries[initialActiveIndex];
      const initRotY = targetRotationY(entry.coordinates[1]);

      const globe = new ThreeGlobe({
        waitForGlobeReady: true,
        animateIn: false,
      })
        // NASA Blue Marble: daytime composite, natural land colours
        .globeImageUrl(GLOBE_TEXTURES.blueMarble)
        // Subtle bump map adds surface topology relief
        .bumpImageUrl(GLOBE_TEXTURES.topology)
        .showAtmosphere(true)
        .atmosphereColor("#02e0e8") // bright cyan glow, matches mockup ring
        .atmosphereAltitude(0.28)
        // Career journey arcs (animated dashes Bolivia → Stafa → Basel)
        .arcsData(CAREER_ARCS)
        .arcStartLat("startLat")
        .arcStartLng("startLng")
        .arcEndLat("endLat")
        .arcEndLng("endLng")
        .arcColor(() => ["#02777C", "#02777C"])
        .arcAltitude((d) => naturalArcAltitude(d as CareerArc))
        .arcStroke(0.4)
        .arcDashLength(0.35)
        .arcDashGap(0.15)
        .arcDashAnimateTime(2400)
        .arcsTransitionDuration(400);

      // HTML label overlay: uses three-globe's built-in projected DOM elements.
      if (initialShowLabel) {
        globe
          .htmlElementsData([
            {
              lat: entry.coordinates[0],
              lng: entry.coordinates[1],
              label: entry.location,
            },
          ])
          .htmlElement((d) => {
            const el = document.createElement("div");
            el.style.cssText = [
              "display:flex",
              "align-items:center",
              "gap:6px",
              "pointer-events:none",
              "white-space:nowrap",
            ].join(";");

            const dot = document.createElement("span");
            dot.style.cssText =
              "width:8px;height:8px;border-radius:50%;background:#02777C;flex-shrink:0;box-shadow:0 0 6px #02777C";

            const tag = document.createElement("span");
            tag.style.cssText = [
              "background:rgba(2,119,124,0.82)",
              "color:#e0fafa",
              "padding:3px 9px",
              "border-radius:4px",
              "font-size:11px",
              "font-family:var(--font-sans,system-ui)",
              "letter-spacing:0.03em",
              "box-shadow:0 2px 10px rgba(0,0,0,0.5)",
            ].join(";");
            tag.textContent = (d as GlobeLabelDatum).label;

            el.appendChild(dot);
            el.appendChild(tag);
            return el;
          })
          .htmlAltitude(0.04);
      }

      // YXZ order: Y rotation (longitude spin) is applied before X rotation
      // (latitude tilt). The targetRotationY/X formulas assume this sequence -
      // Y brings the city to the +Z front face, then X tilts it to visual centre.
      // Three.js default 'XYZ' reverses the order and places cities ~50 px off-centre.
      globe.rotation.order = "YXZ";
      // Set initial rotation without animation
      globe.rotation.y = initRotY;
      globe.rotation.x = targetRotXRef.current; // latitude-centred initial tilt
      targetRotYRef.current = initRotY;

      // Boost the night texture's apparent brightness by adding self-illumination.
      // MeshPhongMaterial.emissive adds a constant colour independent of lighting,
      // making city lights visible even on the globe's "unlit" dark side.
      // Cloud mesh — declared here so the animate() closure can read it.
      let cloudMesh: Mesh | null = null;

      globe.onGlobeReady(() => {
        if (cancelled) return;

        const mat = globe.globeMaterial() as MeshPhongMaterial;
        mat.specular = new THREE.Color(0x000000);
        mat.shininess = 0;
        mat.needsUpdate = true;

        // Blue marble + topology are already applied by three-globe at this point.
        // Build sprites and reveal immediately - no need to wait for night/clouds.
        activeMarkerTexRef.current = makeGlowTexture(THREE, "#02fffe", 1.0);
        inactiveMarkerTexRef.current = makeGlowTexture(THREE, "#02fffe", 0.55);
        spritesRef.current = buildSprites(
          initialActiveIndex,
          camPosRef.current.z,
          THREE,
          globe,
          activeMarkerTexRef.current,
          inactiveMarkerTexRef.current,
        );
        revealGlobe();

        // Stream in night lights and clouds after reveal - each applies as soon
        // as it arrives without blocking the other.
        void loadTexture(THREE, GLOBE_TEXTURES.night)
          .then((nightTex) => {
            if (cancelled) return;
            nightTex.colorSpace = THREE.SRGBColorSpace;
            mat.emissiveMap = nightTex;
            mat.emissive = new THREE.Color(1, 1, 1);
            mat.emissiveIntensity = 0.8;
            mat.needsUpdate = true;
          })
          .catch(() => {});

        void loadTexture(THREE, GLOBE_TEXTURES.clouds)
          .then((cloudTex) => {
            if (cancelled) return;
            const geo = new THREE.SphereGeometry(102, 64, 64);
            const cloudMat = new THREE.MeshPhongMaterial({
              map: cloudTex,
              alphaMap: cloudTex,
              transparent: true,
              opacity: 0.9,
              depthWrite: false,
            });
            cloudMesh = new THREE.Mesh(geo, cloudMat);
            globe.add(cloudMesh);
          })
          .catch(() => {});
      });

      globe.visible = false;
      scene.add(globe);
      globeRef.current = globe as unknown as GlobeInstance;

      const revealGlobe = (): void => {
        if (cancelled) return;
        renderer.render(scene, camera);
        scheduleReveal(() => {
          if (cancelled) return;
          globe.visible = true;
          renderer.render(scene, camera);
          const fadeMs = fadeMsRef.current;
          canvas.style.transition = `opacity ${fadeMs}ms ${GLOBE_FADE_CSS_EASE}`;
          canvas.style.opacity = "1";
          canvas.style.pointerEvents = "auto";
          setIsReady(true);
        });
      };

      // ── Pointer / wheel interaction ───────────────────────────────────────
      // Pointer Events API covers both mouse and touch in one set of handlers.
      // setPointerCapture keeps the drag alive even when the pointer leaves
      // the container (e.g. moving fast across the screen).
      let isDragging = false;
      let dragStartX = 0;
      let dragStartY = 0;
      let dragStartRotY = 0;
      let dragStartRotX = 0;
      // 3D target for camera position; all three components lerp smoothly each frame.
      let userCamVec = { x: 0, y: 40, z: camPosRef.current.z };
      // Momentum: last-frame rotation delta, decays after pointer release
      let velX = 0;
      let velY = 0;
      let lastRotX = 0;
      let lastRotY = 0;

      // Expose to Effect 1 so clicking a location clears momentum immediately
      stopMomentumRef.current = () => {
        velX = 0;
        velY = 0;
      };

      // Expose to Effect 1 so selecting a new location resets the lateral camera
      // offset that accumulates when zooming toward an off-center location.
      resetCamToAxisRef.current = () => {
        userCamVec = {
          x: 0,
          y: 40,
          z: Math.max(115, Math.min(520, camPosRef.current.z)),
        };
      };

      // Tracks camera distance used for the last sprite scale rebuild.
      // 322.5 = sqrt(40^2 + 320^2) = default camera distance from origin.
      let lastMarkerCamDist = camera.position.length();

      const onPointerDown = (e: PointerEvent) => {
        isDragging = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        dragStartRotY = targetRotYRef.current;
        dragStartRotX = targetRotXRef.current;
        // Clear any lingering momentum so the grab feels immediate
        velX = 0;
        velY = 0;
        container.setPointerCapture(e.pointerId);
        container.style.cursor = "grabbing";
      };

      const onPointerMove = (e: PointerEvent) => {
        if (!isDragging) return;
        const deltaX = e.clientX - dragStartX;
        const deltaY = e.clientY - dragStartY;

        // Uniform sensitivity: one globe-radius of pointer travel = 90° rotation.
        // The sphere fills ~78% of the container, so apparent radius ≈ height × 0.39.
        // Using the same factor for both axes eliminates the 2× asymmetry that
        // made diagonal drags feel erratic.
        const globeRadiusPx = container.offsetHeight * 0.39;
        const sensitivity = Math.PI / 2 / globeRadiusPx;

        targetRotYRef.current = dragStartRotY + deltaX * sensitivity;
        const rawX = dragStartRotX - deltaY * sensitivity;
        targetRotXRef.current = Math.max(
          -Math.PI / 2,
          Math.min(Math.PI / 2, rawX),
        );
      };

      const onPointerUp = (e: PointerEvent) => {
        if (!isDragging) return;
        isDragging = false;
        container.releasePointerCapture(e.pointerId);
        container.style.cursor = "grab";
      };

      // Zoom with scroll wheel. passive:false required to call preventDefault.
      // If the active location is on the camera-facing hemisphere, moves the camera
      // toward that 3D point rather than purely along the Z axis. This creates a
      // "zoom toward the selected city" feel, similar to how map apps zoom to cursor.
      const onWheel = (e: WheelEvent) => {
        e.preventDefault();
        // Cap per-event delta so high-resolution trackpads don't jump wildly.
        const step =
          Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY), 80) * 0.25;

        const activeEntry = timelineEntries[activeIndexRef.current];
        const local = latLngToLocal(
          activeEntry.coordinates[0],
          activeEntry.coordinates[1],
          0,
        );
        // Rotate local position into world space using the globe's current rotation.
        // The globe has no translation - only rotation - so applyEuler is sufficient.
        const worldVec = new THREE.Vector3(
          local.x,
          local.y,
          local.z,
        ).applyEuler(globe.rotation);
        const camVec = new THREE.Vector3(
          userCamVec.x,
          userCamVec.y,
          userCamVec.z,
        );

        // dot > 0: location and camera are on the same side of the globe (visible).
        if (worldVec.dot(camVec) > 0) {
          // Direction from camera toward the surface point.
          const dir = worldVec.clone().sub(camVec).normalize();
          // step > 0 (scroll down) = zoom out = move away (addScaledVector with -step < 0)
          // step < 0 (scroll up)   = zoom in  = move toward (addScaledVector with -step > 0)
          const newPos = camVec.addScaledVector(dir, -step);
          const dist = newPos.length();
          if (dist < 115) newPos.multiplyScalar(115 / dist);
          if (dist > 520) newPos.multiplyScalar(520 / dist);
          userCamVec = { x: newPos.x, y: newPos.y, z: newPos.z };
        } else {
          // Location on the back side of the globe: plain Z-axis zoom.
          userCamVec = {
            ...userCamVec,
            z: Math.max(115, Math.min(520, userCamVec.z + step)),
          };
        }
      };

      container.addEventListener("pointerdown", onPointerDown);
      container.addEventListener("pointermove", onPointerMove);
      container.addEventListener("pointerup", onPointerUp);
      container.addEventListener("pointercancel", onPointerUp);
      container.addEventListener("wheel", onWheel, { passive: false });
      container.style.cursor = "grab";

      // ── Visibility tracking ───────────────────────────────────────────────
      // Pause rendering when the globe is scrolled out of view or the tab is
      // hidden. The RAF keeps ticking (cheap early-return) so the loop resumes
      // instantly without a restart when the globe comes back into view.
      let globeInView = true;
      const visibilityObserver = new IntersectionObserver(
        ([entry]) => {
          globeInView = entry.isIntersecting;
        },
        { threshold: 0 },
      );
      visibilityObserver.observe(container);

      // ── Animation loop ────────────────────────────────────────────────────
      let rafId = 0;

      function animate() {
        rafId = requestAnimationFrame(animate);
        if (!globeInView || document.hidden) return;

        // lerpFactor=1.0 during drag: globe follows pointer with zero lag.
        // lerpFactor=0.05 for programmatic timeline transitions: cinematic ease.
        const lerpFactor = isDragging ? 1.0 : 0.05;
        globe.rotation.y +=
          (targetRotYRef.current - globe.rotation.y) * lerpFactor;
        globe.rotation.x +=
          (targetRotXRef.current - globe.rotation.x) * lerpFactor;

        // ── Momentum ─────────────────────────────────────────────────────────
        if (isDragging) {
          // Sample velocity from actual rotation change this frame
          velX = globe.rotation.x - lastRotX;
          velY = globe.rotation.y - lastRotY;
        } else if (Math.abs(velX) > 0.0001 || Math.abs(velY) > 0.0001) {
          // Coasting after release: push the targets forward by the decaying velocity
          targetRotYRef.current += velY;
          const coastX = targetRotXRef.current + velX;
          targetRotXRef.current = Math.max(
            -Math.PI / 2,
            Math.min(Math.PI / 2, coastX),
          );
          velX *= 0.88; // halves every ~5 frames at 60fps
          velY *= 0.88;
        }
        lastRotX = globe.rotation.x;
        lastRotY = globe.rotation.y;

        // Smooth lerp toward the 3D camera target. All three components move
        // together so zoom-toward-location and zoom-toward-Z-axis both feel smooth.
        camPosRef.current.x += (userCamVec.x - camPosRef.current.x) * 0.06;
        camPosRef.current.y += (userCamVec.y - camPosRef.current.y) * 0.06;
        camPosRef.current.z += (userCamVec.z - camPosRef.current.z) * 0.06;
        camera.position.set(
          camPosRef.current.x,
          camPosRef.current.y,
          camPosRef.current.z,
        );
        // Re-aim at globe center each frame. Normally camera direction is fixed,
        // but when X/Y offset from zoom-toward-location is in play the view must
        // be updated so the globe stays centered on screen.
        camera.lookAt(0, 0, 0);

        // Update sprite scales when camera distance changes enough so their
        // apparent angular size stays constant regardless of zoom level.
        const camDist = camera.position.length();
        if (Math.abs(camDist - lastMarkerCamDist) > 3) {
          lastMarkerCamDist = camDist;
          // 322.5 = sqrt(40^2 + 320^2) = default camera distance from origin
          const s = camDist / 322.5;
          spritesRef.current.forEach((sprite) => {
            sprite.scale.setScalar(sprite.userData.baseSize * s);
          });
        }

        // Slow atmospheric drift: clouds move independently of the globe surface.
        if (cloudMesh) cloudMesh.rotation.y += 0.00025;

        renderer.render(scene, camera);
      }

      animate();

      // ── Resize handler ────────────────────────────────────────────────────
      const ro = new ResizeObserver(() => {
        const w = container.offsetWidth;
        const h = container.offsetHeight;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      });
      ro.observe(container);

      // ── Cleanup registration ──────────────────────────────────────────────
      // Comprehensive teardown prevents GPU memory leaks (each leaked WebGL
      // context occupies ~200 MB of GPU memory and browsers cap them at ~16).
      cleanupFns.push(
        // 1. Stop the render loop
        () => cancelAnimationFrame(rafId),
        // 2. Remove interaction listeners
        () => container.removeEventListener("pointerdown", onPointerDown),
        () => container.removeEventListener("pointermove", onPointerMove),
        () => container.removeEventListener("pointerup", onPointerUp),
        () => container.removeEventListener("pointercancel", onPointerUp),
        () => container.removeEventListener("wheel", onWheel),
        // 3. Stop watching container size and visibility
        () => ro.disconnect(),
        () => visibilityObserver.disconnect(),
        // 4. Dispose shared marker textures and sprite list
        () => {
          activeMarkerTexRef.current?.dispose();
          activeMarkerTexRef.current = null;
          inactiveMarkerTexRef.current?.dispose();
          inactiveMarkerTexRef.current = null;
          spritesRef.current = [];
        },
        // 5. Traverse scene and dispose all GPU resources
        () =>
          scene.traverse((obj: Object3D) => {
            if (!(obj instanceof THREE.Mesh)) return;
            obj.geometry?.dispose();
            const mats: Material[] = Array.isArray(obj.material)
              ? obj.material
              : [obj.material];
            for (const m of mats) {
              if (!m) continue;
              const textured = m as Material &
                Partial<Record<MaterialTextureSlot, Texture>>;
              for (const slot of MATERIAL_TEXTURE_SLOTS) {
                textured[slot]?.dispose();
              }
              m.dispose();
            }
          }),
        // 6. Dispose the WebGL renderer (releases the WebGL context)
        () => renderer.dispose(),
        // 7. Remove the <canvas> element that the renderer appended
        () => {
          if (container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement);
          }
        },
        // 8. Null refs so Effect 1 doesn't attempt updates after teardown
        () => {
          globeRef.current = null;
          cameraRef.current = null;
          rendererRef.current = null;
          threeRef.current = null;
        },
        () => setIsReady(false),
      );
    })();

    return () => {
      cancelled = true;
      for (const fn of cleanupFns) {
        fn();
      }
    };
  }, []);

  return (
    <div className="relative h-full w-full">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 1 }}
        animate={{ opacity: isReady ? 0 : 1 }}
        transition={{ duration: fadeDuration, ease: GLOBE_FADE_EASE }}
      >
        <GlobePlaceholder />
      </motion.div>
      <div
        ref={containerRef}
        className={cn(
          "absolute inset-0 h-full w-full",
          !isReady && "pointer-events-none",
        )}
      />
    </div>
  );
}
