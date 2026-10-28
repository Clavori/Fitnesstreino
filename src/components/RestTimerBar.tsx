"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { FastForward, Plus, Timer, X } from "lucide-react";

export const RestTimerBar: React.FC = () => {
  const {
    restTimerActive,
    restTimerSeconds,
    restTimerTarget,
    addRestTimerSeconds,
    stopRestTimer,
  } = useApp();

  if (!restTimerActive) return null;

  const pct = Math.min(
    100,
    Math.max(0, Math.round((restTimerSeconds / (restTimerTarget || 1)) * 100))
  );

  const mins = Math.floor(restTimerSeconds / 60);
  const secs = restTimerSeconds % 60;
  const formatted = `${String(mins).padStart(2, "0")}:${String(secs).padStart(
    2,
    "0"
  )}`;

  return (
    <div className="fixed bottom-20 left-1/2 z-40 w-[92%] max-w-[430px] -translate-x-1/2 overflow-hidden rounded-2xl border border-neon-lime/50 bg-slate-900/95 p-3 shadow-2xl shadow-black backdrop-blur-md">
      {/* Barra de progresso superior */}
      <div className="absolute left-0 top-0 h-1 w-full bg-slate-800">
        <div
          className="h-full bg-gradient-to-r from-neon-lime to-emerald-400 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neon-lime/15 text-neon-lime">
            <Timer className="h-5 w-5 animate-spin" style={{ animationDuration: "6s" }} />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Descanso entre Séries
            </p>
            <p className="font-mono text-2xl font-black leading-none text-white">
              {formatted}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => addRestTimerSeconds(-15)}
            className="rounded-lg border border-slate-700 bg-slate-800 px-2 py-1.5 text-xs font-bold text-slate-300 hover:bg-slate-700"
          >
            -15s
          </button>
          <button
            type="button"
            onClick={() => addRestTimerSeconds(15)}
            className="flex items-center gap-0.5 rounded-lg border border-slate-700 bg-slate-800 px-2 py-1.5 text-xs font-bold text-neon-lime hover:bg-slate-700"
          >
            <Plus className="h-3 w-3" />
            15s
          </button>
          <button
            type="button"
            onClick={stopRestTimer}
            className="flex items-center gap-1 rounded-lg bg-neon-lime px-2.5 py-1.5 text-xs font-extrabold text-slate-950 hover:brightness-110"
          >
            <FastForward className="h-3.5 w-3.5" />
            Pular
          </button>
          <button
            type="button"
            onClick={stopRestTimer}
            className="rounded-lg p-1 text-slate-400 hover:text-white"
            aria-label="Fechar cronômetro"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
