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
  Quaternion,
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

// Build the globe-orientation quaternion for a given location.
// Computed as Q_x(lat − CAM_ELEVATION) × Q_y(−lng) via direct half-angle products,
// matching the XYZ Euler convention used by globe.rotation.order. Order matters:
// Q_y is applied to the marker first (bringing its longitude to the prime meridian),
// then Q_x tilts that meridian-aligned point down to the camera's visual centre.
// Three.js Quaternion constructor takes (x, y, z, w).
function latLngToQuat(THREE: ThreeNamespace, latDeg: number, lngDeg: number) {
  const lng = -(lngDeg * Math.PI) / 180;
  const lat = (latDeg * Math.PI) / 180 - CAM_ELEVATION;
  const cy = Math.cos(lng / 2),
    sy = Math.sin(lng / 2);
  const cx = Math.cos(lat / 2),
    sx = Math.sin(lat / 2);
  return new THREE.Quaternion(cy * sx, sy * cx, sx * sy, cy * cx);
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
const GLOBE_FADE_DURATION_S = 0.65;
const GLOBE_FADE_DURATION_MS = 650;
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
  // Target orientation in SO(3). Null until the init effect loads THREE.
  const targetQuatRef = useRef<Quaternion | null>(null);
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

    // Quaternion slerp in the animation loop picks the shortest arc automatically.
    targetQuatRef.current = latLngToQuat(
      threeRef.current,
      entry.coordinates[0],
      entry.coordinates[1],
    );

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

      // XYZ order ensures globe.rotation decompositions elsewhere (label anchors,
      // atmosphere) are consistent with the Q_x * Q_y quaternion convention -
      // Y (longitude) is applied to local vertices first, then X (latitude tilt),
      // which is the only order that centres off-meridian locations correctly.
      globe.rotation.order = "XYZ";
      // Snap to the initial orientation via quaternion - no accumulated angle state.
      const initQuat = latLngToQuat(
        THREE,
        entry.coordinates[0],
        entry.coordinates[1],
      );
      globe.quaternion.copy(initQuat);
      targetQuatRef.current = initQuat.clone();
      // Non-null alias: targetQuatRef is always set for the lifetime of this effect.
      // Using a typed alias avoids non-null assertions throughout the closures below.
      const tq = targetQuatRef as { current: Quaternion };

      // Boost the night texture's apparent brightness by adding self-illumination.
      // MeshPhongMaterial.emissive adds a constant colour independent of lighting,
      // making city lights visible even on the globe's "unlit" dark side.
      // Cloud mesh — declared here so the animate() closure can read it.
      let cloudMesh: Mesh | null = null;

      globe.onGlobeReady(() => {
        void (async () => {
          if (cancelled) return;

          const mat = globe.globeMaterial() as MeshPhongMaterial;
          mat.specular = new THREE.Color(0x000000);
          mat.shininess = 0;
          mat.needsUpdate = true;

          try {
            const [nightTex, cloudTex] = await Promise.all([
              loadTexture(THREE, GLOBE_TEXTURES.night),
              loadTexture(THREE, GLOBE_TEXTURES.clouds),
            ]);
            if (cancelled) return;

            nightTex.colorSpace = THREE.SRGBColorSpace;
            mat.emissiveMap = nightTex;
            mat.emissive = new THREE.Color(1, 1, 1);
            mat.emissiveIntensity = 0.8;
            mat.needsUpdate = true;

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
          } catch {
            if (cancelled) return;
          }

          // Build shared glow textures once - reused on every activeIndex change.
          activeMarkerTexRef.current = makeGlowTexture(THREE, "#02fffe", 1.0);
          inactiveMarkerTexRef.current = makeGlowTexture(
            THREE,
            "#02fffe",
            0.55,
          );
          spritesRef.current = buildSprites(
            initialActiveIndex,
            camPosRef.current.z,
            THREE,
            globe,
            activeMarkerTexRef.current,
            inactiveMarkerTexRef.current,
          );

          if (!cancelled) {
            revealGlobe();
          }
        })();
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
      // 3D target for camera position; all three components lerp smoothly each frame.
      let userCamVec = { x: 0, y: 40, z: camPosRef.current.z };

      // Quaternion rotation state - all orientation tracking lives in SO(3).
      // Pre-allocated to avoid per-frame / per-event heap allocation.
      const _yAxis = new THREE.Vector3(0, 1, 0);
      const _xAxis = new THREE.Vector3(1, 0, 0);
      const _qA = new THREE.Quaternion(); // scratch A
      const _qB = new THREE.Quaternion(); // scratch B
      const _identQuat = new THREE.Quaternion(); // permanent identity
      const velQuat = new THREE.Quaternion(); // per-frame angular velocity; identity = no momentum
      const _dragOriginQuat = new THREE.Quaternion(); // orientation at pointer-down
      let _dragOriginLatRad = 0; // latitude of drag origin (for X-clamp range)
      const _lastDragQuat = new THREE.Quaternion(); // target on the previous frame

      // Expose to Effect 1 so clicking a location clears momentum immediately
      stopMomentumRef.current = () => {
        velQuat.identity();
      };

      // Expose to Effect 1 so selecting a new location resets the lateral camera
      // offset that accumulates when zooming toward an off-center location.
      // Projects the current camera position back onto the canonical Z-axis at
      // the same distance from the origin, preserving the Y:Z = 40:320 ratio so
      // the elevation angle CAM_ELEVATION assumes stays constant at any zoom
      // level. Without this, latLngToQuat targets the wrong latitude after a
      // zoom-toward-location and the new entry lands off the visual centre.
      resetCamToAxisRef.current = () => {
        const r = Math.hypot(
          camPosRef.current.x,
          camPosRef.current.y,
          camPosRef.current.z,
        );
        // Wheel handler clamps the camera distance from origin to [115, 520];
        // mirror that here so reset never escapes the allowed zoom band.
        const clampedR = Math.max(115, Math.min(520, r));
        const k = clampedR / Math.hypot(40, 320);
        userCamVec = { x: 0, y: 40 * k, z: 320 * k };
      };

      // Tracks camera distance used for the last sprite scale rebuild.
      // 322.5 = sqrt(40^2 + 320^2) = default camera distance from origin.
      let lastMarkerCamDist = camera.position.length();

      const onPointerDown = (e: PointerEvent) => {
        isDragging = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        // Snap the target to the globe's currently visible orientation so an
        // in-flight slerp doesn't jump the rest of the way the instant
        // lerpFactor flips to 1.0. The drag (or just-a-click) then starts
        // from where the user actually sees the globe, not its prior target.
        tq.current.copy(globe.quaternion);
        _dragOriginQuat.copy(tq.current);
        // Extract latitude of drag origin directly from quaternion components.
        // Formula for XYZ (Q_x * Q_y) convention: sin(lat) = 2*(w·x + y·z).
        const { w, x, y, z } = _dragOriginQuat;
        _dragOriginLatRad = Math.asin(
          Math.max(-1, Math.min(1, 2 * (w * x + y * z))),
        );
        _lastDragQuat.copy(tq.current);
        velQuat.identity();
        container.setPointerCapture(e.pointerId);
        container.style.cursor = "grabbing";
      };

      const onPointerMove = (e: PointerEvent) => {
        if (!isDragging) return;

        // Uniform sensitivity: one globe-radius of pointer travel = 90° rotation.
        // The sphere fills ~78% of the container, so apparent radius ≈ height × 0.39.
        const sensitivity = Math.PI / 2 / (container.offsetHeight * 0.39);
        const deltaLng = (e.clientX - dragStartX) * sensitivity;
        const deltaLat = -((e.clientY - dragStartY) * sensitivity);

        // Clamp latitude delta to keep the globe within ±90° (prevents polar flip).
        const clampedLat = Math.max(
          -Math.PI / 2 - _dragOriginLatRad,
          Math.min(Math.PI / 2 - _dragOriginLatRad, deltaLat),
        );

        // Q_new = Q_x(Δlat) * Q_origin * Q_y(Δlng)
        // Pre-multiplying Q_x adds to the latitude; post-multiplying Q_y adds to
        // the longitude. Matches the new Q_x * Q_y convention - X is the outer
        // rotation (world-frame tilt), Y is the inner (globe-frame spin).
        _qA.setFromAxisAngle(_yAxis, deltaLng);
        _qB.setFromAxisAngle(_xAxis, clampedLat);
        tq.current.copy(_dragOriginQuat).premultiply(_qB).multiply(_qA);
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
        // Quaternion slerp always picks the shortest arc on SO(3) — no shortestPath
        // arithmetic needed and no sensitivity to accumulated angle drift.
        globe.quaternion.slerp(tq.current, lerpFactor);

        // ── Momentum ─────────────────────────────────────────────────────────
        if (isDragging) {
          // Velocity = right-relative delta quaternion from last frame to this one.
          // velQuat = Q_last⁻¹ * Q_now; applied as post-multiply it correctly
          // advances both longitude and latitude in their respective directions.
          velQuat.copy(_lastDragQuat).invert().multiply(tq.current);
          _lastDragQuat.copy(tq.current);
        } else if (velQuat.w < 1 - 1e-10) {
          // Coasting: advance the target by the velocity quaternion, then decay.
          tq.current.multiply(velQuat);

          // Pole clamp: sin(lat) = 2*(w·x + y·z) for Q_x*Q_y quaternions.
          // If latitude would exceed ±90°, reconstruct and kill all momentum.
          // At the pole, longitude is encoded by atan2(z, x) since x = s_α·c_β
          // and z = s_α·s_β when s_α ≠ 0.
          const { w: qw, x: qx, y: qy, z: qz } = tq.current;
          const sinLat = 2 * (qw * qx + qy * qz);
          if (Math.abs(sinLat) > 1 - 1e-6) {
            const lng = Math.atan2(qz, qx);
            _qA.setFromAxisAngle(_yAxis, lng);
            _qB.setFromAxisAngle(_xAxis, (Math.sign(sinLat) * Math.PI) / 2);
            tq.current.copy(_qB).multiply(_qA);
            velQuat.identity();
          }

          // Decay velocity toward identity — halves every ~5 frames at 60 fps.
          velQuat.slerp(_identQuat, 0.12);
        }

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
