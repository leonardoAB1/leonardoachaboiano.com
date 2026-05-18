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

    function buildMarkers(activeIdx: number) {
      return timelineEntries.map((entry, i) => ({
        location: entry.coordinates as [number, number],
        size: i === activeIdx ? 0.08 : 0.04,
      }));
    }

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
        mapBrightness: 8,
        mapBaseBrightness: 0,
        baseColor: [0, 0, 0],
        markerColor: [0.1, 0.95, 0.9],
        glowColor: [0.02, 0.45, 0.5],
        markers: buildMarkers(activeIndexRef.current),
      });

      // Cobe v2: drive animation with a manual requestAnimationFrame loop
      function tick() {
        if (!globe) return;

        const idx = activeIndexRef.current;
        const [latDeg, lngDeg] = timelineEntries[idx].coordinates;

        // Correct phi formula derived from cobe's coordinate system:
        // At phi=0 the camera faces 0° lat / 0° lng.
        // To centre longitude L, we need phi = -(PI/2 + L_rad).
        const lngRad = (lngDeg * Math.PI) / 180;
        const targetPhi = -(Math.PI / 2 + lngRad);

        phiRef.current += (targetPhi - phiRef.current) * 0.05;

        globe.update({
          phi: phiRef.current,
          markers: buildMarkers(idx),
        });

        // Label: project lat/lng → 2D canvas coords using cobe's orthographic model.
        // At theta=0: cameraX = cos(lat)*cos(phi+lngRad), cameraY = sin(lat).
        // Screen coords (range [0,1]): screenX = (cameraX+1)/2, screenY = (-cameraY+1)/2.
        if (labelRef.current && showLabel) {
          const latRad = (latDeg * Math.PI) / 180;
          const cameraX = Math.cos(latRad) * Math.cos(phiRef.current + lngRad);
          const cameraY = Math.sin(latRad);
          const visible = -(Math.cos(latRad) * Math.sin(phiRef.current + lngRad)) >= 0;

          labelRef.current.style.display = visible ? "flex" : "none";
          labelRef.current.style.left = `${((cameraX + 1) / 2) * width}px`;
          labelRef.current.style.top = `${((-cameraY + 1) / 2) * width}px`;
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
      <canvas ref={canvasRef} className="h-full w-full" />
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
