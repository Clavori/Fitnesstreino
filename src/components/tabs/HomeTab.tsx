"use client";

import React, { useState } from "react";
import { useApp, getTodayIso } from "@/context/AppContext";
import { getExerciseById } from "@/data/exercises";
import { ExerciseMannequin } from "@/components/ExerciseMannequin";
import {
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Droplets,
  Dumbbell,
  Eye,
  Flame,
  Play,
  Plus,
  Sparkles,
  Timer,
  Trash2,
  Trophy,
} from "lucide-react";

export const HomeTab: React.FC = () => {
  const {
    profile,
    weeklyPlan,
    selectedDayOfWeek,
    setSelectedDayOfWeek,
    currentDayPlan,
    toggleSetComplete,
    updateSetData,
    removeExerciseFromDay,
    finishWorkoutOfTheDay,
    setSelectedExerciseModal,
    startRestTimer,
    nutrition,
    nutritionTargets,
    nutritionConsumed,
    addWaterMl,
    setActiveTab,
    attendance,
  } = useApp();

  const [expandedExIdx, setExpandedExIdx] = useState<number>(0);

  const todayIso = getTodayIso();
  const trainedToday = attendance[todayIso]?.status === "trained";

  // Progresso das séries do treino selecionado
  const totalSets = currentDayPlan.exercises.reduce(
    (acc, ex) => acc + ex.setLogs.length,
    0
  );
  const completedSets = currentDayPlan.exercises.reduce(
    (acc, ex) => acc + ex.setLogs.filter((s) => s.completed).length,
    0
  );
  const progressPct =
    totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

  return (
    <div className="space-y-5 pb-28">
      {/* HEADER DO ALUNO + STREAK + PONTOS */}
      <header className="flex items-center justify-between gap-3 rounded-3xl border border-slate-800/80 bg-gradient-to-r from-slate-900 via-[#0E1629] to-slate-900 p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTab("perfil")}
            className="relative shrink-0"
          >
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="h-13 w-13 h-12 w-12 rounded-2xl object-cover ring-2 ring-neon-lime"
            />
            <span className="absolute -bottom-1 -right-1 rounded-full bg-neon-lime px-1.5 py-0.2 text-[9px] font-black uppercase text-slate-950">
              {profile.level.slice(0, 4)}
            </span>
          </button>
          <div>
            <p className="text-xs text-slate-400">Bora esmagar hoje,</p>
            <h1 className="text-lg font-black leading-tight text-white">
              {profile.name}
            </h1>
            <div className="mt-0.5 flex items-center gap-2 text-[11px]">
              <span className="text-neon-lime font-semibold">
                {profile.goal === "ganhar_massa"
                  ? "🎯 Ganhar Massa"
                  : profile.goal === "emagrecer"
                  ? "🔥 Emagrecer"
                  : "⚡ Manter Shape"}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">{profile.weightKg} kg</span>
            </div>
          </div>
        </div>

        {/* Badges de Streak e Pontos */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("calendario")}
            className="flex flex-col items-center rounded-2xl border border-orange-500/30 bg-orange-500/10 px-3 py-1.5 text-orange-400"
            title="Dias seguidos treinando"
          >
            <div className="flex items-center gap-1">
              <Flame className="h-4 w-4 fill-orange-500 text-orange-400" />
              <span className="text-sm font-black">{profile.currentStreak}</span>
            </div>
            <span className="text-[9px] font-bold uppercase tracking-wider">
              Streak
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("ranking")}
            className="flex flex-col items-center rounded-2xl border border-neon-lime/30 bg-neon-lime/10 px-3 py-1.5 text-neon-lime"
            title="Pontuação no Ranking"
          >
            <div className="flex items-center gap-1">
              <Trophy className="h-4 w-4" />
              <span className="text-sm font-black">{profile.points}</span>
            </div>
            <span className="text-[9px] font-bold uppercase tracking-wider">
              Pontos
            </span>
          </button>
        </div>
      </header>

      {/* SELETOR DE DIAS DA SEMANA (SEG A DOM) */}
      <div>
        <div className="mb-2 flex items-center justify-between px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Programação da Semana
          </span>
          <button
            type="button"
            onClick={() => setActiveTab("treino")}
            className="flex items-center gap-1 text-xs font-bold text-neon-lime hover:underline"
          >
            Biblioteca (+40 Exercícios) <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {[1, 2, 3, 4, 5, 6, 0].map((dayNum) => {
            const plan = weeklyPlan.find((d) => d.dayOfWeek === dayNum);
            const isSelected = selectedDayOfWeek === dayNum;
            const isToday = new Date().getDay() === dayNum;
            return (
              <button
                key={dayNum}
                type="button"
                onClick={() => setSelectedDayOfWeek(dayNum)}
                className={`flex flex-col items-center justify-center rounded-2xl border py-2 transition-all ${
                  isSelected
                    ? "border-neon-lime bg-neon-lime text-slate-950 shadow-lg shadow-neon-lime/20"
                    : "border-slate-800 bg-slate-900/80 text-slate-300 hover:border-slate-700"
                }`}
              >
                <span className="text-[10px] font-extrabold uppercase">
                  {plan?.shortDay}
                </span>
                <span
                  className={`mt-0.5 text-[9px] font-bold ${
                    isSelected ? "text-slate-900" : "text-slate-400"
                  }`}
                >
                  {plan?.isRestDay ? "Off" : `${plan?.exercises.length} ex`}
                </span>
                {isToday && (
                  <span
                    className={`mt-1 h-1.5 w-1.5 rounded-full ${
                      isSelected ? "bg-slate-950" : "bg-neon-lime"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* CARD PRINCIPAL: TREINO DO DIA */}
      <section className="overflow-hidden rounded-3xl border border-neon-lime/30 bg-gradient-to-br from-[#111A2E] via-[#0B1220] to-slate-950 p-4 shadow-xl">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-neon-lime px-2.5 py-0.5 text-[11px] font-black uppercase text-slate-950">
                <Dumbbell className="h-3 w-3 stroke-[3]" />{" "}
                {currentDayPlan.dayName}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] font-semibold text-slate-300">
                <Clock className="h-3 w-3 text-neon-lime" />{" "}
                {currentDayPlan.estimatedMinutes} min
              </span>
              {trainedToday && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" /> Check-in Feito!
                </span>
              )}
            </div>
            <h2 className="mt-2 text-xl font-black leading-snug text-white">
              {currentDayPlan.title}
            </h2>
            <p className="mt-0.5 text-xs text-slate-400">
              Foco muscular:{" "}
              <strong className="text-neon-lime">
                {currentDayPlan.muscleFocus}
              </strong>
            </p>
          </div>
        </div>

        {/* Barra de progresso das séries */}
        {!currentDayPlan.isRestDay && (
          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">
                Progresso do Treino ({completedSets}/{totalSets} séries)
              </span>
              <span className="font-black text-neon-lime">{progressPct}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-neon-lime transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}

        {/* LISTA DE EXERCÍCIOS DO TREINO DO DIA */}
        {currentDayPlan.isRestDay ? (
          <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-center">
            <p className="text-base font-bold text-white">
              😴 Dia de Descanso e Supercompensação
            </p>
            <p className="mt-1 text-xs text-slate-400">
              O músculo cresce no descanso! Mantenha sua meta de proteínas e
              hidratação em dia, ou adicione um exercício abaixo se quiser
              treinar hoje.
            </p>
            <button
              type="button"
              onClick={() => setActiveTab("treino")}
              className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-slate-800 px-4 py-2.5 text-xs font-bold text-neon-lime hover:bg-slate-700"
            >
              <Plus className="h-4 w-4" /> Adicionar Exercícios Mesmo Assim
            </button>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {currentDayPlan.exercises.map((item, exIdx) => {
              const catalog = getExerciseById(item.exerciseId);
              const isExpanded = expandedExIdx === exIdx;
              const doneSets = item.setLogs.filter((s) => s.completed).length;
              const allSetsDone = doneSets === item.setLogs.length;

              return (
                <div
                  key={`${item.exerciseId}-${exIdx}`}
                  className={`overflow-hidden rounded-2xl border transition-all ${
                    allSetsDone
                      ? "border-emerald-500/40 bg-emerald-950/15"
                      : isExpanded
                      ? "border-slate-700 bg-slate-900/95"
                      : "border-slate-800/90 bg-slate-900/60"
                  }`}
                >
                  {/* Cabeçalho do Exercício */}
                  <div className="flex items-center justify-between gap-2 p-3.5">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedExIdx(isExpanded ? -1 : exIdx)
                      }
                      className="flex flex-1 items-center gap-3 text-left"
                    >
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-black ${
                          allSetsDone
                            ? "bg-emerald-500 text-slate-950"
                            : "bg-slate-800 text-neon-lime"
                        }`}
                      >
                        {allSetsDone ? (
                          <Check className="h-5 w-5 stroke-[3]" />
                        ) : (
                          `${exIdx + 1}º`
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-extrabold text-white">
                          {catalog.name}
                        </h3>
                        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                          <span>
                            {item.sets} séries × {item.reps} reps
                          </span>
                          <span>•</span>
                          <span className="text-neon-lime font-semibold">
                            {item.targetWeightKg} kg
                          </span>
                          <span>•</span>
                          <span>⏱ {item.restSeconds}s</span>
                        </div>
                      </div>
                    </button>

                    {/* Botão Ver Boneco Animado */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedExerciseModal(catalog)}
                        className="flex items-center gap-1 rounded-xl border border-neon-lime/40 bg-neon-lime/10 px-2.5 py-2 text-[11px] font-bold text-neon-lime hover:bg-neon-lime/20"
                        title="Ver Boneco Demonstrando o Exercício"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Boneco 3D/2D
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          removeExerciseFromDay(
                            currentDayPlan.dayOfWeek,
                            exIdx
                          )
                        }
                        className="rounded-xl p-2 text-slate-500 hover:bg-rose-950/40 hover:text-rose-400"
                        title="Remover exercício"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Gaveta Expandida: Mini Boneco em Loop + Tabela de Séries e Cargas */}
                  {isExpanded && (
                    <div className="border-t border-slate-800/80 px-3.5 pb-3.5 pt-3">
                      {/* Preview rápido do Boneco executando o movimento */}
                      <div className="mb-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                        <ExerciseMannequin
                          pattern={catalog.animationPattern}
                          muscleGroup={catalog.muscleGroup}
                          compact
                        />
                        <div className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-950/60 p-3 text-xs">
                          <div>
                            <p className="font-bold uppercase tracking-wider text-neon-lime">
                              Dica Chave de Postura:
                            </p>
                            <p className="mt-1 text-slate-300 leading-relaxed">
                              {catalog.postureTips[0]}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center justify-between border-t border-slate-800 pt-2">
                            <button
                              type="button"
                              onClick={() => setSelectedExerciseModal(catalog)}
                              className="font-bold text-neon-lime underline"
                            >
                              Ver erros comuns e postura
                            </button>
                            <button
                              type="button"
                              onClick={() => startRestTimer(item.restSeconds)}
                              className="inline-flex items-center gap-1 rounded-lg bg-slate-800 px-2 py-1 text-[11px] font-semibold text-white hover:bg-slate-700"
                            >
                              <Timer className="h-3 w-3 text-neon-lime" />{" "}
                              {item.restSeconds}s
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Linhas de Séries */}
                      <div className="space-y-2">
                        <div className="grid grid-cols-12 px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          <span className="col-span-2">Série</span>
                          <span className="col-span-4 text-center">
                            Carga (kg)
                          </span>
                          <span className="col-span-3 text-center">Reps</span>
                          <span className="col-span-3 text-right">
                            Concluir
                          </span>
                        </div>

                        {item.setLogs.map((setEntry, sIdx) => (
                          <div
                            key={setEntry.setNumber}
                            className={`grid grid-cols-12 items-center gap-2 rounded-xl border px-2.5 py-2 transition ${
                              setEntry.completed
                                ? "border-emerald-500/40 bg-emerald-500/10"
                                : "border-slate-800 bg-slate-950/60"
                            }`}
                          >
                            <div className="col-span-2">
                              <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-slate-800 text-xs font-extrabold text-slate-300">
                                {setEntry.setNumber}ª
                              </span>
                            </div>

                            <div className="col-span-4">
                              <input
                                type="number"
                                min={0}
                                value={setEntry.weightKg}
                                onChange={(e) =>
                                  updateSetData(
                                    currentDayPlan.dayOfWeek,
                                    exIdx,
                                    sIdx,
                                    Number(e.target.value),
                                    setEntry.reps
                                  )
                                }
                                aria-label={`Carga da ${setEntry.setNumber}ª série`}
                                className="w-full rounded-lg border border-slate-700 bg-slate-900 py-1.5 text-center text-xs font-extrabold text-white focus:border-neon-lime focus:outline-none"
                              />
                            </div>

                            <div className="col-span-3">
                              <input
                                type="text"
                                value={setEntry.reps}
                                onChange={(e) =>
                                  updateSetData(
                                    currentDayPlan.dayOfWeek,
                                    exIdx,
                                    sIdx,
                                    setEntry.weightKg,
                                    e.target.value
                                  )
                                }
                                aria-label={`Repetições da ${setEntry.setNumber}ª série`}
                                className="w-full rounded-lg border border-slate-700 bg-slate-900 py-1.5 text-center text-xs font-bold text-slate-200 focus:border-neon-lime focus:outline-none"
                              />
                            </div>

                            <div className="col-span-3 flex justify-end">
                              <button
                                type="button"
                                onClick={() =>
                                  toggleSetComplete(
                                    currentDayPlan.dayOfWeek,
                                    exIdx,
                                    sIdx
                                  )
                                }
                                className={`flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-extrabold transition ${
                                  setEntry.completed
                                    ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                                    : "border border-slate-700 bg-slate-800 text-slate-300 hover:border-neon-lime hover:text-white"
                                }`}
                              >
                                <Check className="h-3.5 w-3.5 stroke-[3]" />
                                {setEntry.completed ? "Feito" : "OK"}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Botões de Adicionar Exercício e FINALIZAR TREINO */}
            <div className="flex flex-col gap-2.5 pt-2 sm:flex-row">
              <button
                type="button"
                onClick={() => setActiveTab("treino")}
                className="flex items-center justify-center gap-1.5 rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3.5 text-xs font-bold text-slate-200 hover:border-neon-lime/50"
              >
                <Plus className="h-4 w-4 text-neon-lime" />
                Editar / Adicionar Exercício
              </button>

              <button
                type="button"
                onClick={() =>
                  finishWorkoutOfTheDay(
                    currentDayPlan.dayOfWeek,
                    currentDayPlan.estimatedMinutes
                  )
                }
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-neon-lime to-emerald-400 px-5 py-4 text-sm font-black uppercase tracking-wide text-slate-950 shadow-xl shadow-neon-lime/25 transition hover:brightness-110 active:scale-[0.99]"
              >
                <Play className="h-4 w-4 fill-slate-950" />
                Finalizar Treino (+180 PTS)
              </button>
            </div>
          </div>
        )}
      </section>

      {/* WIDGET RÁPIDO: NUTRIÇÃO E HIDRATAÇÃO DO DIA */}
      <section className="grid grid-cols-2 gap-3">
        {/* Card de Hidratação Rápida */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/75 p-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-cyan-400">
              <Droplets className="h-4 w-4" /> Água Hoje
            </span>
            <span className="text-[11px] font-bold text-slate-400">
              Meta: {nutritionTargets.waterTargetMl}ml
            </span>
          </div>
          <p className="mt-2 text-2xl font-black text-white">
            {nutrition.waterMl}{" "}
            <span className="text-xs font-normal text-slate-400">ml</span>
          </p>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-cyan-400 transition-all"
              style={{
                width: `${Math.min(
                  100,
                  Math.round(
                    (nutrition.waterMl / nutritionTargets.waterTargetMl) * 100
                  )
                )}%`,
              }}
            />
          </div>
          <div className="mt-3 flex gap-1.5">
            <button
              type="button"
              onClick={() => addWaterMl(250)}
              className="flex-1 rounded-xl bg-cyan-500/15 py-2 text-xs font-extrabold text-cyan-300 hover:bg-cyan-500/25"
            >
              +250ml
            </button>
            <button
              type="button"
              onClick={() => addWaterMl(500)}
              className="flex-1 rounded-xl bg-cyan-500/15 py-2 text-xs font-extrabold text-cyan-300 hover:bg-cyan-500/25"
            >
              +500ml
            </button>
          </div>
        </div>

        {/* Card de Proteína & Calorias */}
        <button
          type="button"
          onClick={() => setActiveTab("alimentacao")}
          className="flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/75 p-4 text-left hover:border-slate-700"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-xs font-extrabold uppercase tracking-wider text-neon-lime">
                <Sparkles className="h-4 w-4" /> Shape & Dieta
              </span>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </div>
            <p className="mt-2 text-xl font-black text-white">
              {nutritionConsumed.calories}{" "}
              <span className="text-xs font-normal text-slate-400">
                / {nutritionTargets.calories} kcal
              </span>
            </p>
          </div>
          <div className="mt-3 space-y-1.5 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-400">Proteínas:</span>
              <span className="font-bold text-emerald-400">
                {nutritionConsumed.proteinG}g / {nutritionTargets.proteinG}g
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Carboidratos:</span>
              <span className="font-bold text-amber-400">
                {nutritionConsumed.carbsG}g / {nutritionTargets.carbsG}g
              </span>
            </div>
          </div>
        </button>
      </section>
    </div>
  );
};
