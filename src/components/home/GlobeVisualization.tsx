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
  const targetRotYRef = useRef(
    targetRotationY(timelineEntries[activeIndex].coordinates[1]),
  );
  const prevRotYRef = useRef(targetRotYRef.current);
  const camZRef = useRef(260);

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
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(W, H);
      renderer.setClearColor(0x000000, 0); // transparent canvas background
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // ── Scene ─────────────────────────────────────────────────────────────
      const scene = new THREE.Scene();

      // ── Camera ────────────────────────────────────────────────────────────
      // Offset Y slightly so the view tilts toward the northern hemisphere,
      // matching the mockup perspective.
      const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 2000);
      camera.position.set(0, 40, 260);
      camera.lookAt(0, 0, 0);
      cameraRef.current = camera;
      camZRef.current = 260;

      // ── Lighting ──────────────────────────────────────────────────────────
      // Very dim ambient so the night-side of the Earth stays nearly black,
      // letting city lights in the texture dominate.
      scene.add(new THREE.AmbientLight(0x334466, 2.5));
      const sun = new THREE.DirectionalLight(0xaaaacc, 0.9);
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
        .arcAltitude(0.35)
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
        mat.emissive = new THREE.Color(0x223355);
        mat.emissiveIntensity = 0.7;
      });

      scene.add(globe);
      globeRef.current = globe;

      // ── Animation loop ────────────────────────────────────────────────────
      let rafId = 0;

      function animate() {
        rafId = requestAnimationFrame(animate);

        // Smooth rotation toward target longitude
        const curY = globe.rotation.y;
        const tgtY = targetRotYRef.current;
        globe.rotation.y += (tgtY - curY) * 0.05;

        // Zoom: camera Z decreases (moves closer) proportional to rotation speed.
        // Using sqrt compression so nearby-location transitions also feel kinetic.
        const velocity = Math.abs(globe.rotation.y - prevRotYRef.current);
        prevRotYRef.current = globe.rotation.y;
        const zoomIn = Math.min(Math.sqrt(velocity * 6), 0.25);
        const targetZ = 260 * (1 - zoomIn);
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
        // 2. Stop watching container size
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
