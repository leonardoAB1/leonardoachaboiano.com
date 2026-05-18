"use client";

import { useEffect, useRef } from "react";
import { timelineEntries } from "@/data/timeline";

interface GlobeVisualizationProps {
  activeIndex: number;
  showLabel?: boolean;
}

// Career arcs: unique location transitions in chronological order
const CAREER_ARCS = [
  // Santa Cruz → Stafa (Bolivia to Switzerland)
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
  return Math.sin(angle / 2) * 0.4;
}

// THREE.SphereGeometry UV derivation: at rotation.y=0 the camera (+Z) sees lng=-90°.
// To centre longitude L: rotation.y = L_rad + π/2.
function targetRotationY(lngDeg: number) {
  return (lngDeg * Math.PI) / 180 + Math.PI / 2;
}

// Normalise target to take the shortest arc from current rotation.
function shortestPath(current: number, target: number) {
  let t = target;
  while (t - current > Math.PI) t -= 2 * Math.PI;
  while (t - current < -Math.PI) t += 2 * Math.PI;
  return t;
}

export function GlobeVisualization({
  activeIndex,
  showLabel = true,
}: GlobeVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mutable state shared between the two effects via refs (no re-renders needed).
  const globeRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const targetRotXRef = useRef(-0.12); // vertical tilt, matches initial globe.rotation.x
  const targetRotYRef = useRef(
    targetRotationY(timelineEntries[activeIndex].coordinates[1]),
  );
  const prevRotYRef = useRef(targetRotYRef.current);
  const camZRef = useRef(320);

  // ── Effect 1: react to activeIndex changes ───────────────────────────────
  // Separated from the init effect so changes don't re-create the globe.
  useEffect(() => {
    if (!globeRef.current) return;

    const entry = timelineEntries[activeIndex];
    const raw = targetRotationY(entry.coordinates[1]);

    // Shortest-path normalisation prevents the globe spinning the long way around.
    targetRotYRef.current = shortestPath(
      globeRef.current.rotation.y,
      raw,
    );

    // Update marker sizes: active entry gets a larger, brighter dot.
    globeRef.current.pointsData(buildPoints(activeIndex));

    // Swap the HTML label to the new location.
    if (showLabel) {
      globeRef.current.htmlElementsData([
        { lat: entry.coordinates[0], lng: entry.coordinates[1], label: entry.location },
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

      const ThreeGlobe = ThreeGlobeModule.default;
      const W = container.offsetWidth;
      const H = container.offsetHeight;

      // ── Renderer ──────────────────────────────────────────────────────────
      // alpha:false + opaque clear colour eliminates the visible white/grey
      // square in light mode. The container is clipped to a circle via CSS
      // border-radius so the "space" background appears as a dark disc, not a box.
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(W, H);
      renderer.setClearColor(0x030508, 1); // near-black "space" background
      container.appendChild(renderer.domElement);
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
      camZRef.current = 320;

      // ── Lighting ──────────────────────────────────────────────────────────
      // Very dim ambient so the night-side of the Earth stays nearly black,
      // letting city lights in the texture dominate.
      scene.add(new THREE.AmbientLight(0xffffff, 0.5));
      const sun = new THREE.DirectionalLight(0xffffff, 0.8);
      sun.position.set(-2, 1, 1);
      scene.add(sun);

      // ── Three-Globe ───────────────────────────────────────────────────────
      const entry = timelineEntries[activeIndex];
      const initRotY = targetRotationY(entry.coordinates[1]);

      const globe = new ThreeGlobe({ waitForGlobeReady: true, animateIn: false })
        // Earth night texture: NASA city-lights-from-space imagery
        .globeImageUrl(
          "//unpkg.com/three-globe/example/img/earth-night.jpg",
        )
        // Subtle bump map adds surface topology relief
        .bumpImageUrl(
          "//unpkg.com/three-globe/example/img/earth-topology.png",
        )
        .showAtmosphere(true)
        .atmosphereColor("#02777C") // brand teal atmospheric glow
        .atmosphereAltitude(0.18)
        // Career location markers
        .pointsData(buildPoints(activeIndex))
        .pointLat("lat")
        .pointLng("lng")
        .pointAltitude("altitude")
        .pointColor("color")
        .pointRadius("radius")
        .pointResolution(16)
        .pointsMerge(false)
        // Career journey arcs (animated dashes Bolivia → Stafa → Basel)
        .arcsData(CAREER_ARCS)
        .arcStartLat("startLat")
        .arcStartLng("startLng")
        .arcEndLat("endLat")
        .arcEndLng("endLng")
        .arcColor(() => ["#02777C", "#02777C"])
        .arcAltitude((d: any) => naturalArcAltitude(d))
        .arcStroke(0.4)
        .arcDashLength(0.35)
        .arcDashGap(0.15)
        .arcDashAnimateTime(2400)
        .arcsTransitionDuration(400);

      // HTML label overlay: uses three-globe's built-in projected DOM elements.
      if (showLabel) {
        globe
          .htmlElementsData([
            { lat: entry.coordinates[0], lng: entry.coordinates[1], label: entry.location },
          ])
          .htmlElement((d: any) => {
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
            tag.textContent = d.label;

            el.appendChild(dot);
            el.appendChild(tag);
            return el;
          })
          .htmlAltitude(0.04);
      }

      // Set initial rotation without animation
      globe.rotation.y = initRotY;
      globe.rotation.x = -0.12; // subtle northern-hemisphere tilt
      targetRotYRef.current = initRotY;
      prevRotYRef.current = initRotY;

      // Boost the night texture's apparent brightness by adding self-illumination.
      // MeshPhongMaterial.emissive adds a constant colour independent of lighting,
      // making city lights visible even on the globe's "unlit" dark side.
      globe.onGlobeReady(() => {
        const mat = globe.globeMaterial() as any;
        mat.emissive = new THREE.Color(0x111111);
        mat.emissiveIntensity = 0.35;
      });

      scene.add(globe);
      globeRef.current = globe;

      // ── Pointer / wheel interaction ───────────────────────────────────────
      // Pointer Events API covers both mouse and touch in one set of handlers.
      // setPointerCapture keeps the drag alive even when the pointer leaves
      // the container (e.g. moving fast across the screen).
      let isDragging = false;
      let dragStartX = 0;
      let dragStartY = 0;
      let dragStartRotY = 0;
      let dragStartRotX = 0;
      let userCamZ = camZRef.current;
      // Momentum: last-frame rotation delta, decays after pointer release
      let velX = 0;
      let velY = 0;
      let lastRotX = 0;
      let lastRotY = 0;

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
      const onWheel = (e: WheelEvent) => {
        e.preventDefault();
        // Cap per-event delta so high-resolution trackpads don't jump wildly.
        const step = Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY), 80) * 0.25;
        userCamZ = Math.max(230, Math.min(520, userCamZ + step));
      };

      container.addEventListener("pointerdown", onPointerDown);
      container.addEventListener("pointermove", onPointerMove);
      container.addEventListener("pointerup", onPointerUp);
      container.addEventListener("pointercancel", onPointerUp);
      container.addEventListener("wheel", onWheel, { passive: false });
      container.style.cursor = "grab";

      // ── Animation loop ────────────────────────────────────────────────────
      let rafId = 0;

      function animate() {
        rafId = requestAnimationFrame(animate);

        // lerpFactor=1.0 during drag: globe follows pointer with zero lag.
        // lerpFactor=0.05 for programmatic timeline transitions: cinematic ease.
        const lerpFactor = isDragging ? 1.0 : 0.05;
        globe.rotation.y += (targetRotYRef.current - globe.rotation.y) * lerpFactor;
        globe.rotation.x += (targetRotXRef.current - globe.rotation.x) * lerpFactor;

        // ── Momentum ─────────────────────────────────────────────────────────
        if (isDragging) {
          // Sample velocity from actual rotation change this frame
          velX = globe.rotation.x - lastRotX;
          velY = globe.rotation.y - lastRotY;
        } else if (Math.abs(velX) > 0.0001 || Math.abs(velY) > 0.0001) {
          // Coasting after release: push the targets forward by the decaying velocity
          targetRotYRef.current += velY;
          const coastX = targetRotXRef.current + velX;
          targetRotXRef.current = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, coastX));
          velX *= 0.88; // halves every ~5 frames at 60fps
          velY *= 0.88;
        }
        lastRotX = globe.rotation.x;
        lastRotY = globe.rotation.y;

        // Auto-zoom during fast programmatic rotations; also honour the
        // user's scroll-wheel zoom level.
        const velocity = Math.abs(globe.rotation.y - prevRotYRef.current);
        prevRotYRef.current = globe.rotation.y;
        const zoomIn = isDragging
          ? 0
          : Math.min(Math.sqrt(velocity * 6), 0.25);
        const targetZ = userCamZ * (1 - zoomIn);
        camZRef.current += (targetZ - camZRef.current) * 0.06;
        camera.position.z = camZRef.current;

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
        // 3. Stop watching container size
        () => ro.disconnect(),
        // 3. Traverse scene and dispose all GPU resources
        () =>
          scene.traverse((obj: any) => {
            if (!obj.isMesh) return;
            obj.geometry?.dispose();
            const mats: any[] = Array.isArray(obj.material)
              ? obj.material
              : [obj.material];
            mats.forEach((m) => {
              if (!m) return;
              // Dispose every texture slot
              (
                [
                  "map",
                  "bumpMap",
                  "normalMap",
                  "specularMap",
                  "emissiveMap",
                  "alphaMap",
                  "aoMap",
                  "lightMap",
                ] as const
              ).forEach((slot) => m[slot]?.dispose());
              m.dispose();
            });
          }),
        // 4. Dispose the WebGL renderer (releases the WebGL context)
        () => renderer.dispose(),
        // 5. Remove the <canvas> element that the renderer appended
        () => {
          if (container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement);
          }
        },
        // 6. Null refs so Effect 1 doesn't attempt updates after teardown
        () => {
          globeRef.current = null;
          cameraRef.current = null;
          rendererRef.current = null;
        },
      );
    })();

    return () => {
      cancelled = true;
      cleanupFns.forEach((fn) => fn());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={containerRef} className="h-full w-full" />;
}

// ── Helpers ────────────────────────────────────────────────────────────────

function buildPoints(activeIdx: number) {
  return timelineEntries.map((entry, i) => ({
    lat: entry.coordinates[0],
    lng: entry.coordinates[1],
    altitude: i === activeIdx ? 0.025 : 0.01,
    color: i === activeIdx ? "#02fffe" : "rgba(2,255,254,0.45)",
    radius: i === activeIdx ? 0.55 : 0.28,
  }));
}
