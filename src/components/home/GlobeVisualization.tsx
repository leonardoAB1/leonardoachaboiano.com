"use client";

import createGlobe from "cobe";
import { useEffect, useRef } from "react";
import { timelineEntries } from "@/data/timeline";

interface GlobeVisualizationProps {
  activeIndex: number;
  /** When true the globe fills the container; label is shown */
  showLabel?: boolean;
}

export function GlobeVisualization({
  activeIndex,
  showLabel = true,
}: GlobeVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phiRef = useRef(0);
  const labelRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(activeIndex);

  // Keep a ref in sync so the onRender closure always reads the latest value
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let rafId = 0;
    let width = canvas.offsetWidth;
    let globe: ReturnType<typeof createGlobe> | undefined;

    const markers = timelineEntries.map((entry) => ({
      location: entry.coordinates as [number, number],
      size: 0.05,
    }));

    function startGlobe() {
      if (!canvas) return;
      width = canvas.offsetWidth;

      globe = createGlobe(canvas, {
        devicePixelRatio,
        width: width * devicePixelRatio,
        height: width * devicePixelRatio,
        phi: phiRef.current,
        theta: 0.2,
        dark: 1,
        diffuse: 1.2,
        mapSamples: 16000,
        mapBrightness: 6,
        baseColor: [0.05, 0.46, 0.48],
        markerColor: [0.08, 0.9, 0.85],
        glowColor: [0.05, 0.5, 0.5],
        markers,
      });

      // Cobe v2 uses globe.update() in a manual rAF loop rather than onRender
      function tick() {
        if (!globe) return;

        const idx = activeIndexRef.current;
        const [latDeg, lngDeg] = timelineEntries[idx].coordinates;
        const targetPhi = -(lngDeg * Math.PI) / 180;

        // Smooth interpolation toward the target longitude
        phiRef.current += (targetPhi - phiRef.current) * 0.05;

        globe.update({ phi: phiRef.current });

        // Position the label via 3D → 2D orthographic projection
        if (labelRef.current && showLabel) {
          const latRad = (latDeg * Math.PI) / 180;
          const lngRad = (lngDeg * Math.PI) / 180;
          const diffPhi = lngRad - phiRef.current;

          const x3d = Math.cos(latRad) * Math.sin(diffPhi);
          const y3d = Math.sin(latRad);
          const z3d = Math.cos(latRad) * Math.cos(diffPhi);

          const radius = width / 2;
          const x2d = width / 2 + x3d * radius;
          const y2d = width / 2 - y3d * radius;

          labelRef.current.style.display = z3d > 0 ? "flex" : "none";
          labelRef.current.style.left = `${x2d}px`;
          labelRef.current.style.top = `${y2d}px`;
        }

        rafId = requestAnimationFrame(tick);
      }

      rafId = requestAnimationFrame(tick);
    }

    const observer = new ResizeObserver(() => {
      if (!canvas) return;
      const newWidth = canvas.offsetWidth;
      if (Math.abs(newWidth - width) < 1) return;
      cancelAnimationFrame(rafId);
      globe?.destroy();
      startGlobe();
    });

    startGlobe();
    observer.observe(canvas);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      globe?.destroy();
    };
  }, [showLabel]);

  return (
    <div className="relative h-full w-full">
      <canvas
        ref={canvasRef}
        className="h-full w-full"
        style={{ aspectRatio: "1 / 1" }}
      />
      {showLabel && (
        <div
          ref={labelRef}
          className="pointer-events-none absolute hidden -translate-x-1/2 -translate-y-full items-center gap-1.5 whitespace-nowrap pb-2"
        >
          <span className="h-2 w-2 rounded-full bg-brand" />
          <span className="rounded bg-surface-0/80 px-2 py-0.5 text-xs font-medium text-ink-1 backdrop-blur-sm">
            {timelineEntries[activeIndex].location}
          </span>
        </div>
      )}
    </div>
  );
}
