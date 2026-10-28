"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import {
  CheckCircle2,
  Dumbbell,
  Flame,
  Share2,
  Trophy,
  X,
} from "lucide-react";

export const WorkoutShareModal: React.FC = () => {
  const {
    completedWorkoutModal,
    setCompletedWorkoutModal,
    profile,
    showToast,
    setActiveTab,
  } = useApp();

  if (!completedWorkoutModal) return null;

  const handleShare = async () => {
    const shareText = `🔥 Treino Pago na FORJA!\n🏋️ ${completedWorkoutModal.title}\n⚡ Volume total: ${completedWorkoutModal.totalVolumeKg.toLocaleString("pt-BR")} kg\n🏆 +${completedWorkoutModal.pointsEarned} pts | Sequência: ${completedWorkoutModal.newStreak} dias seguidos!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Treino Concluído — FORJA",
          text: shareText,
        });
        return;
      } catch {
        // Fallback para área de transferência
      }
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareText);
      showToast("Resumo copiado! Pronto para colar no WhatsApp ou Instagram!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
      <div className="w-full max-w-sm overflow-hidden rounded-3xl border border-neon-lime/40 bg-gradient-to-b from-slate-900 via-[#0B1222] to-slate-950 p-6 text-white shadow-2xl">
        {/* Card "Story Ready" */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-neon-lime/20 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-neon-lime">
            <CheckCircle2 className="h-4 w-4" /> Treino Concluído!
          </span>
          <button
            type="button"
            onClick={() => setCompletedWorkoutModal(null)}
            className="rounded-full bg-slate-800 p-1.5 text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-neon-lime text-slate-950 shadow-lg shadow-neon-lime/30">
            <Trophy className="h-9 w-9 stroke-[2.5]" />
          </div>
          <h2 className="mt-3 text-2xl font-black tracking-tight">
            +{completedWorkoutModal.pointsEarned} PONTOS!
          </h2>
          <p className="mt-1 text-xs text-slate-300">
            {completedWorkoutModal.title}
          </p>
        </div>

        {/* Estatísticas do Treino */}
        <div className="mt-5 grid grid-cols-3 gap-2.5 rounded-2xl border border-slate-800 bg-slate-900/90 p-3.5 text-center">
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-400">
              Tonelagem
            </p>
            <p className="mt-0.5 text-base font-black text-neon-lime">
              {completedWorkoutModal.totalVolumeKg.toLocaleString("pt-BR")}kg
            </p>
          </div>
          <div className="border-x border-slate-800">
            <p className="text-[10px] font-bold uppercase text-slate-400">
              Séries Feitas
            </p>
            <p className="mt-0.5 text-base font-black text-white">
              {completedWorkoutModal.setsCompleted} séries
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-400">
              Sequência
            </p>
            <p className="mt-0.5 flex items-center justify-center gap-1 text-base font-black text-orange-400">
              <Flame className="h-4 w-4 fill-orange-400" />
              {completedWorkoutModal.newStreak}d
            </p>
          </div>
        </div>

        {/* Assinatura do Aluno */}
        <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-900/60 px-3 py-2 text-xs">
          <div className="flex items-center gap-2">
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="h-8 w-8 rounded-full object-cover ring-2 ring-neon-lime"
            />
            <div>
              <p className="font-bold text-white">{profile.name}</p>
              <p className="text-[10px] text-slate-400">
                Grupo: {profile.gymCode}
              </p>
            </div>
          </div>
          <span className="flex items-center gap-1 font-bold text-neon-lime">
            <Dumbbell className="h-3.5 w-3.5" /> FORJA APP
          </span>
        </div>

        {/* Botões */}
        <div className="mt-5 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-neon-lime py-3.5 text-sm font-extrabold text-slate-950 shadow-lg shadow-neon-lime/25 hover:brightness-110"
          >
            <Share2 className="h-4 w-4 stroke-[2.5]" />
            Compartilhar Conquista nas Redes
          </button>
          <button
            type="button"
            onClick={() => {
              setCompletedWorkoutModal(null);
              setActiveTab("ranking");
            }}
            className="w-full rounded-xl border border-slate-700 bg-slate-800/80 py-3 text-xs font-bold text-slate-200 hover:bg-slate-800"
          >
            Ver Minha Posição no Ranking 🏆
          </button>
        </div>
      </div>
    </div>
  );
};
