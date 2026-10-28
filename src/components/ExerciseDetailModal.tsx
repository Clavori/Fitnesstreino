"use client";

import React from "react";
import { ExerciseCatalogItem, LoadProgressionPoint } from "@/types/fitness";
import { ExerciseMannequin } from "./ExerciseMannequin";
import {
  AlertTriangle,
  CheckCircle2,
  Dumbbell,
  Flame,
  Plus,
  TrendingUp,
  X,
} from "lucide-react";

interface ExerciseDetailModalProps {
  exercise: ExerciseCatalogItem | null;
  onClose: () => void;
  onAddToTodayWorkout?: (exercise: ExerciseCatalogItem) => void;
  loadHistory?: LoadProgressionPoint[];
}

export const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({
  exercise,
  onClose,
  onAddToTodayWorkout,
  loadHistory = [],
}) => {
  if (!exercise) return null;

  const maxLoad =
    loadHistory.length > 0
      ? Math.max(...loadHistory.map((p) => p.weightKg))
      : exercise.defaultWeightKg;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-3xl border border-slate-800 bg-dark-900 p-5 text-white shadow-2xl sm:rounded-3xl">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-neon-lime/15 px-2.5 py-0.5 text-xs font-bold text-neon-lime">
                {exercise.muscleGroup}
              </span>
              <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs text-slate-300">
                {exercise.equipment}
              </span>
              <span className="rounded-full bg-orange-500/15 px-2.5 py-0.5 text-xs font-medium capitalize text-orange-400">
                {exercise.difficulty}
              </span>
            </div>
            <h2 className="text-xl font-extrabold leading-tight text-white">
              {exercise.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-700 bg-slate-800/80 p-2 text-slate-300 hover:bg-slate-700 hover:text-white"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Boneco Biomecânico Demonstrando o Exercício */}
        <ExerciseMannequin
          pattern={exercise.animationPattern}
          muscleGroup={exercise.muscleGroup}
        />

        {/* Resumo da execução */}
        <p className="mt-3 rounded-xl border border-slate-800 bg-slate-900/70 p-3 text-xs leading-relaxed text-slate-300">
          {exercise.executionSummary}
        </p>

        {/* Músculos Trabalhados */}
        <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-3.5">
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Flame className="h-4 w-4 text-neon-orange" />
            Músculos Trabalhados
          </div>
          <div className="space-y-2 text-xs">
            <div>
              <span className="font-semibold text-neon-lime">Primários: </span>
              <span className="text-slate-200">
                {exercise.primaryMuscles.join(", ")}
              </span>
            </div>
            {exercise.secondaryMuscles.length > 0 && (
              <div>
                <span className="font-semibold text-orange-400">
                  Secundários / Sinergistas:{" "}
                </span>
                <span className="text-slate-300">
                  {exercise.secondaryMuscles.join(", ")}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Dicas de Postura Correta */}
        <div className="mt-3 rounded-2xl border border-emerald-500/25 bg-emerald-950/20 p-3.5">
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            Dicas de Postura & Execução Perfeita
          </div>
          <ul className="space-y-1.5 text-xs text-slate-200">
            {exercise.postureTips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Erros Comuns a Evitar */}
        <div className="mt-3 rounded-2xl border border-rose-500/25 bg-rose-950/20 p-3.5">
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-400">
            <AlertTriangle className="h-4 w-4" />
            Erros Comuns (Evite Lesões!)
          </div>
          <ul className="space-y-1.5 text-xs text-slate-200">
            {exercise.commonMistakes.map((mistake, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" />
                <span>{mistake}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Evolução de Carga nesse Exercício */}
        {loadHistory.length > 0 && (
          <div className="mt-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-neon-lime">
                <TrendingUp className="h-4 w-4" /> Evolução de Carga
              </span>
              <span className="font-bold text-white">PR Atual: {maxLoad} kg</span>
            </div>
            <div className="flex h-20 items-end justify-between gap-2 pt-3">
              {loadHistory.map((item, i) => {
                const heightPct = Math.max(
                  25,
                  Math.round((item.weightKg / (maxLoad || 1)) * 100)
                );
                return (
                  <div
                    key={i}
                    className="flex flex-1 flex-col items-center gap-1"
                  >
                    <span className="text-[10px] font-bold text-neon-lime">
                      {item.weightKg}kg
                    </span>
                    <div
                      className="w-full rounded-t-md bg-gradient-to-t from-emerald-600 to-neon-lime transition-all"
                      style={{ height: `${heightPct}%` }}
                    />
                    <span className="text-[10px] text-slate-400">
                      {item.date}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Ações */}
        <div className="mt-5 flex gap-2.5">
          {onAddToTodayWorkout && (
            <button
              type="button"
              onClick={() => {
                onAddToTodayWorkout(exercise);
                onClose();
              }}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-neon-lime px-4 py-3.5 text-sm font-extrabold text-slate-950 shadow-lg shadow-neon-lime/20 transition hover:brightness-110"
            >
              <Plus className="h-4 w-4 stroke-[3]" />
              Incluir no Treino de Hoje
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3.5 text-sm font-bold text-slate-200 hover:bg-slate-700"
          >
            <Dumbbell className="h-4 w-4" />
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
};
