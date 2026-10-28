"use client";

import React from "react";
import { AppProvider, useApp } from "@/context/AppContext";
import { HomeTab } from "@/components/tabs/HomeTab";
import { WorkoutLibraryTab } from "@/components/tabs/WorkoutLibraryTab";
import { NutritionTab } from "@/components/tabs/NutritionTab";
import { CalendarTab } from "@/components/tabs/CalendarTab";
import { RankingTab } from "@/components/tabs/RankingTab";
import { ProfileTab } from "@/components/tabs/ProfileTab";
import { BottomNav } from "@/components/BottomNav";
import { RestTimerBar } from "@/components/RestTimerBar";
import { ExerciseDetailModal } from "@/components/ExerciseDetailModal";
import { WorkoutShareModal } from "@/components/WorkoutShareModal";
import { Dumbbell, Flame } from "lucide-react";

const AppShell: React.FC = () => {
  const {
    activeTab,
    selectedExerciseModal,
    setSelectedExerciseModal,
    addExerciseToDay,
    selectedDayOfWeek,
    loadHistory,
    toastMessage,
  } = useApp();

  return (
    <div className="mx-auto min-h-screen w-full max-w-[480px] border-x border-slate-900/90 bg-[#070A12] shadow-2xl shadow-black">
      {/* Top Bar Compacta da Marca FORJA */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-800/80 bg-[#070A12]/90 px-4 py-2.5 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-neon-lime text-slate-950 shadow-md shadow-neon-lime/20">
            <Dumbbell className="h-4 w-4 stroke-[2.8]" />
          </div>
          <div>
            <span className="text-base font-black tracking-tight text-white">
              FORJA
            </span>
            <span className="ml-1.5 rounded-md bg-neon-lime/15 px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-neon-lime">
              IRON PWA
            </span>
          </div>
        </div>

        <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
          <Flame className="h-3.5 w-3.5 text-orange-500" /> Constância Molda o
          Shape
        </span>
      </div>

      {/* Notificação Toast Flutuante */}
      {toastMessage && (
        <div className="fixed left-1/2 top-14 z-50 w-[90%] max-w-[420px] -translate-x-1/2 rounded-2xl border border-neon-lime bg-slate-900/95 px-4 py-3 text-center text-xs font-extrabold text-neon-lime shadow-2xl shadow-black">
          {toastMessage}
        </div>
      )}

      {/* Conteúdo Principal da Aba Ativa */}
      <main className="px-3.5 pt-3.5">
        {activeTab === "inicio" && <HomeTab />}
        {activeTab === "treino" && <WorkoutLibraryTab />}
        {activeTab === "alimentacao" && <NutritionTab />}
        {activeTab === "calendario" && <CalendarTab />}
        {activeTab === "ranking" && <RankingTab />}
        {activeTab === "perfil" && <ProfileTab />}
      </main>

      {/* Modal de Detalhes e Boneco 2D/3D do Exercício */}
      <ExerciseDetailModal
        exercise={selectedExerciseModal}
        onClose={() => setSelectedExerciseModal(null)}
        onAddToTodayWorkout={(ex) => addExerciseToDay(selectedDayOfWeek, ex)}
        loadHistory={
          selectedExerciseModal
            ? loadHistory[selectedExerciseModal.id] || []
            : []
        }
      />

      {/* Modal de Treino Concluído + Compartilhamento */}
      <WorkoutShareModal />

      {/* Cronômetro Flutuante de Descanso entre Séries */}
      <RestTimerBar />

      {/* Navegação Inferior Fixa com 6 Abas */}
      <BottomNav />
    </div>
  );
};

export default function HomePage() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
