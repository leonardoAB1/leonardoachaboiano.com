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
  const prevPhiRef = useRef(0);   // previous frame phi, used to compute rotation velocity
  const scaleRef = useRef(1);     // current zoom scale, driven by rotation velocity
  const labelRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(activeIndex);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let rafId = 0;
    let canvasW = canvas.offsetWidth;
    let canvasH = canvas.offsetHeight;
    let globe: ReturnType<typeof createGlobe> | undefined;

    function buildMarkers(activeIdx: number) {
      return timelineEntries.map((entry, i) => ({
        location: entry.coordinates as [number, number],
        size: i === activeIdx ? 0.08 : 0.04,
      }));
    }

    function startGlobe() {
      if (!canvas) return;
      canvasW = canvas.offsetWidth;
      canvasH = canvas.offsetHeight;

      globe = createGlobe(canvas, {
        devicePixelRatio,
        width: canvasW * devicePixelRatio,
        height: canvasH * devicePixelRatio,
        phi: phiRef.current,
        theta: 0.2,
        dark: 1,
        diffuse: 1.2,
        mapSamples: 16000,
        // baseColor must be non-zero: continents = baseColor × mapBrightness × texture.
        // With black base the texture contribution is always zero and the globe goes dark.
        mapBrightness: 6,
        mapBaseBrightness: 0,
        baseColor: [0.04, 0.22, 0.26],
        markerColor: [0.1, 0.95, 0.9],
        glowColor: [0.02, 0.45, 0.5],
        markers: buildMarkers(activeIndexRef.current),
      });

      function tick() {
        if (!globe) return;

        const idx = activeIndexRef.current;
        const [latDeg, lngDeg] = timelineEntries[idx].coordinates;
        const lngRad = (lngDeg * Math.PI) / 180;

        // phi = -(PI/2 + lng_rad) centres the given longitude at the front of the globe
        const targetPhi = -(Math.PI / 2 + lngRad);
        phiRef.current += (targetPhi - phiRef.current) * 0.05;

        // Zoom: scale up proportional to sqrt of angular velocity so even small
        // rotations (nearby locations) produce a noticeable zoom-in feel.
        const velocity = Math.abs(phiRef.current - prevPhiRef.current);
        prevPhiRef.current = phiRef.current;
        const targetScale = 1 + Math.min(Math.sqrt(velocity * 8), 0.28);
        scaleRef.current += (targetScale - scaleRef.current) * 0.06;

        globe.update({
          phi: phiRef.current,
          scale: scaleRef.current,
          markers: buildMarkers(idx),
        });

        // Project lat/lng → 2D overlay coords.
        // cobe's orthographic model at theta=0:
        //   cameraX = cos(lat) × cos(phi + lng)  (accounts for aspect ratio)
        //   cameraY = sin(lat)
        // Screen [0,1]: x = (cameraX / aspectRatio + 1) / 2, y = (-cameraY + 1) / 2
        if (labelRef.current && showLabel) {
          const latRad = (latDeg * Math.PI) / 180;
          const cameraX = Math.cos(latRad) * Math.cos(phiRef.current + lngRad);
          const cameraY = Math.sin(latRad);
          const visible = -(Math.cos(latRad) * Math.sin(phiRef.current + lngRad)) >= 0;
          const aspectRatio = canvasW / canvasH;

          labelRef.current.style.display = visible ? "flex" : "none";
          labelRef.current.style.left = `${((cameraX / aspectRatio + 1) / 2) * canvasW}px`;
          labelRef.current.style.top = `${((-cameraY + 1) / 2) * canvasH}px`;
        }

        rafId = requestAnimationFrame(tick);
      }

      rafId = requestAnimationFrame(tick);
    }

    const observer = new ResizeObserver(() => {
      if (!canvas) return;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      if (Math.abs(w - canvasW) < 1 && Math.abs(h - canvasH) < 1) return;
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
