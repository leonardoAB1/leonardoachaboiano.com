"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { TimelineEntry } from "@/data/timeline";
import { GlobeVisualization } from "./GlobeVisualization";

interface GlobeModalProps {
  entry: TimelineEntry | null;
  activeIndex: number;
  onClose: () => void;
}

export function GlobeModal({ entry, activeIndex, onClose }: GlobeModalProps) {
  return (
    <AnimatePresence>
      {entry && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            key="sheet"
            className="fixed inset-x-0 bottom-0 z-50 flex flex-col rounded-t-2xl bg-surface-0 dark:bg-[#0d1a1a]"
            style={{ maxHeight: "92svh" }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 35 }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="h-1 w-10 rounded-full bg-border" />
            </div>

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-1.5 text-ink-3 transition-colors hover:bg-surface-2 hover:text-ink-1"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {/* Globe */}
            <div className="relative mx-auto w-full max-w-sm flex-1 px-4 pt-2">
              <GlobeVisualization activeIndex={activeIndex} showLabel={false} />
            </div>

            {/* Entry details */}
            <div className="flex flex-col gap-1 px-6 pb-10 pt-4">
              <p className="text-lg font-semibold text-ink-1">{entry.role}</p>
              <p className="text-sm text-ink-2">
                {entry.org}&nbsp;&middot;&nbsp;{entry.location}
              </p>
              <p className="text-xs text-ink-4">{entry.dateRange}</p>
              {entry.note && (
                <p className="mt-1 text-xs text-ink-3">{entry.note}</p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
