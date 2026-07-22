import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, RotateCcw, AlertTriangle, Command } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StickySaveBarProps {
  isVisible: boolean;
  onSave: () => void;
  onDiscard: () => void;
  isSaving?: boolean;
}

export const StickySaveBar: React.FC<StickySaveBarProps> = ({
  isVisible,
  onSave,
  onDiscard,
  isSaving = false,
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="fixed inset-x-0 bottom-0 z-50"
        >
          {/* Top gradient border */}
          <div className="h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

          <div className="border-t border-white/[0.04] bg-[#0a101e]/95 px-6 py-3 backdrop-blur-2xl">
            <div className="mx-auto flex max-w-[1600px] items-center justify-between">
              {/* Left: Warning */}
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-500/25 bg-amber-500/10 shadow-sm shadow-amber-500/5">
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white/90">
                    Unsaved Configuration Changes
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Modified payroll parameters detected — save before navigating away
                  </p>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDiscard}
                  className="btn-ripple h-9 gap-1.5 px-4 text-xs text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Discard Changes
                </Button>

                <Button
                  variant="default"
                  size="sm"
                  onClick={onSave}
                  disabled={isSaving}
                  className="btn-ripple h-9 gap-1.5 bg-gradient-to-r from-indigo-600 to-blue-600 px-5 text-xs font-semibold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-500 hover:to-blue-500"
                >
                  {isSaving ? (
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    <Save className="h-3.5 w-3.5" />
                  )}
                  {isSaving ? "Saving..." : "Save Settings"}
                  {!isSaving && (
                    <span className="kbd-badge ml-1.5 border-white/10 bg-white/10 text-white/70">
                      ⌘S
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
