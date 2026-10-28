"use client";

import React, { useMemo, useState } from "react";
import { useApp } from "@/context/AppContext";
import { EXERCISES_CATALOG, MUSCLE_GROUPS } from "@/data/exercises";
import { ExerciseMannequin } from "@/components/ExerciseMannequin";
import { ExperienceLevel, FitnessGoal, MuscleGroup } from "@/types/fitness";
import {
  Dumbbell,
  Eye,
  Filter,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
} from "lucide-react";

export const WorkoutLibraryTab: React.FC = () => {
  const {
    profile,
    selectedDayOfWeek,
    currentDayPlan,
    addExerciseToDay,
    setSelectedExerciseModal,
    regeneratePlanForGoalAndLevel,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | "Todos">(
    "Todos"
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    ExperienceLevel | "todos"
  >("todos");
  const [showGeneratorPanel, setShowGeneratorPanel] = useState(false);

  const filteredExercises = useMemo(() => {
    return EXERCISES_CATALOG.filter((ex) => {
      const matchesMuscle =
        selectedMuscle === "Todos" || ex.muscleGroup === selectedMuscle;
      const matchesDiff =
        selectedDifficulty === "todos" || ex.difficulty === selectedDifficulty;
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        ex.name.toLowerCase().includes(q) ||
        ex.muscleGroup.toLowerCase().includes(q) ||
        ex.equipment.toLowerCase().includes(q) ||
        ex.primaryMuscles.some((m) => m.toLowerCase().includes(q));

      return matchesMuscle && matchesDiff && matchesQuery;
    });
  }, [searchQuery, selectedMuscle, selectedDifficulty]);

  const handleRegenerate = (goal: FitnessGoal, level: ExperienceLevel) => {
    regeneratePlanForGoalAndLevel(goal, level);
    setShowGeneratorPanel(false);
  };

  return (
    <div className="space-y-4 pb-28">
      {/* Cabeçalho da Biblioteca */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-[#0E1629] to-slate-950 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="inline-flex items-center gap-1 rounded-full bg-neon-lime/15 px-2.5 py-0.5 text-[11px] font-extrabold uppercase text-neon-lime">
              <Dumbbell className="h-3 w-3" /> {EXERCISES_CATALOG.length}{" "}
              Exercícios com Boneco 2D/3D
            </span>
            <h1 className="mt-1.5 text-xl font-black text-white">
              Biblioteca & Execução Biomecânica
            </h1>
            <p className="mt-0.5 text-xs text-slate-400">
              Toque em qualquer exercício para ver o boneco em movimento,
              músculos alvo, postura correta e erros comuns.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowGeneratorPanel(!showGeneratorPanel)}
            className="flex shrink-0 items-center gap-1.5 rounded-2xl border border-neon-lime/40 bg-neon-lime/10 px-3 py-2 text-xs font-extrabold text-neon-lime hover:bg-neon-lime/20"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Gerar Ficha
          </button>
        </div>

        {/* Gerador Inteligente de Ficha por Objetivo e Nível */}
        {showGeneratorPanel && (
          <div className="mt-4 rounded-2xl border border-neon-lime/30 bg-slate-950/90 p-3.5">
            <p className="text-xs font-bold uppercase tracking-wider text-neon-lime">
              Gerador Automático de Treinos (Objetivo + Nível)
            </p>
            <p className="mt-0.5 text-[11px] text-slate-400">
              Recria sua semana inteira de treinos ajustando volume, séries e
              tempo de descanso (você continua podendo editar qualquer exercício).
            </p>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => handleRegenerate("emagrecer", profile.level)}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 py-2.5 text-xs font-bold text-orange-400 hover:border-orange-400"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Ficha Emagrecimento
              </button>
              <button
                type="button"
                onClick={() => handleRegenerate("ganhar_massa", profile.level)}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 py-2.5 text-xs font-bold text-neon-lime hover:border-neon-lime"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Ficha Ganhar Massa
              </button>
              <button
                type="button"
                onClick={() => handleRegenerate("manter_shape", profile.level)}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 py-2.5 text-xs font-bold text-cyan-400 hover:border-cyan-400"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Ficha Manter Shape
              </button>
            </div>
          </div>
        )}

        {/* Barra de Busca */}
        <div className="relative mt-4">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar exercício, músculo ou equipamento (ex: supino, glúteo, polia)..."
            className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 py-3 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:border-neon-lime focus:outline-none"
          />
        </div>

        {/* Filtro por Grupo Muscular */}
        <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {(["Todos", ...MUSCLE_GROUPS] as const).map((group) => {
            const active = selectedMuscle === group;
            return (
              <button
                key={group}
                type="button"
                onClick={() => setSelectedMuscle(group)}
                className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-extrabold transition ${
                  active
                    ? "bg-neon-lime text-slate-950 shadow-md shadow-neon-lime/20"
                    : "border border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700"
                }`}
              >
                {group}
              </button>
            );
          })}
        </div>

        {/* Filtro Secundário por Nível */}
        <div className="mt-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-slate-400">Nível:</span>
            {(["todos", "iniciante", "intermediario", "avancado"] as const).map(
              (lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSelectedDifficulty(lvl)}
                  className={`rounded-lg px-2 py-0.5 text-[11px] font-bold capitalize ${
                    selectedDifficulty === lvl
                      ? "bg-slate-700 text-neon-lime"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {lvl}
                </button>
              )
            )}
          </div>
          <span className="font-bold text-slate-400">
            {filteredExercises.length} encontrados
          </span>
        </div>
      </div>

      {/* Grid de Exercícios com Boneco Animado */}
      <div className="grid grid-cols-1 gap-3.5">
        {filteredExercises.map((ex) => (
          <div
            key={ex.id}
            className="overflow-hidden rounded-3xl border border-slate-800/90 bg-slate-900/75 p-4 transition hover:border-slate-700"
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-12 sm:items-center">
              {/* Boneco Animado em Loop */}
              <div
                onClick={() => setSelectedExerciseModal(ex)}
                className="cursor-pointer sm:col-span-5"
              >
                <ExerciseMannequin
                  pattern={ex.animationPattern}
                  muscleGroup={ex.muscleGroup}
                  compact
                />
              </div>

              {/* Detalhes, Postura e Ações */}
              <div className="flex flex-col justify-between sm:col-span-7">
                <div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="rounded-full bg-neon-lime/15 px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-neon-lime">
                      {ex.muscleGroup}
                    </span>
                    <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                      {ex.equipment}
                    </span>
                    <span className="rounded-full bg-orange-500/15 px-2 py-0.5 text-[10px] font-semibold capitalize text-orange-400">
                      {ex.difficulty}
                    </span>
                  </div>

                  <h3 className="mt-1.5 text-base font-black text-white">
                    {ex.name}
                  </h3>
                  <p className="mt-1 text-xs text-slate-300 line-clamp-2">
                    {ex.executionSummary}
                  </p>

                  {/* Músculos Primários e Dica Rápida */}
                  <div className="mt-2 space-y-1 rounded-xl border border-slate-800/90 bg-slate-950/60 p-2.5 text-[11px]">
                    <p className="text-slate-300">
                      <strong className="text-neon-lime">Músculos:</strong>{" "}
                      {ex.primaryMuscles.join(", ")}
                    </p>
                    <p className="text-emerald-300">
                      <strong>✓ Postura:</strong> {ex.postureTips[0]}
                    </p>
                    <p className="text-rose-300">
                      <strong>✗ Evite:</strong> {ex.commonMistakes[0]}
                    </p>
                  </div>
                </div>

                {/* Botões */}
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedExerciseModal(ex)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 py-2.5 text-xs font-bold text-white hover:border-neon-lime/50"
                  >
                    <Eye className="h-3.5 w-3.5 text-neon-lime" />
                    Ver Completo
                  </button>
                  <button
                    type="button"
                    onClick={() => addExerciseToDay(selectedDayOfWeek, ex)}
                    className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-neon-lime py-2.5 text-xs font-extrabold text-slate-950 hover:brightness-110"
                  >
                    <Plus className="h-3.5 w-3.5 stroke-[3]" />
                    Add ({currentDayPlan.shortDay})
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
