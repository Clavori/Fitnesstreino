"use client";

import React, { useMemo, useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  Copy,
  Crown,
  Flame,
  Medal,
  Plus,
  Swords,
  Trophy,
  Users,
} from "lucide-react";

export const RankingTab: React.FC = () => {
  const {
    profile,
    competitors,
    gymGroups,
    joinOrCreateGymGroup,
    showToast,
  } = useApp();

  const [period, setPeriod] = useState<"semanal" | "geral">("geral");
  const [scope, setScope] = useState<"todos" | "meu_grupo">("todos");
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [inviteCodeInput, setInviteCodeInput] = useState("");
  const [newGroupName, setNewGroupName] = useState("");

  // Filtrar e ordenar competidores
  const rankedList = useMemo(() => {
    const filtered =
      scope === "meu_grupo"
        ? competitors.filter((c) => c.gymCode === profile.gymCode)
        : competitors;

    return [...filtered].sort((a, b) =>
      period === "semanal"
        ? b.weeklyPoints - a.weeklyPoints
        : b.points - a.points
    );
  }, [competitors, scope, period, profile.gymCode]);

  const top1 = rankedList[0];
  const top2 = rankedList[1];
  const top3 = rankedList[2];

  const userIndex = rankedList.findIndex((c) => c.isCurrentUser);
  const userPosition = userIndex >= 0 ? userIndex + 1 : rankedList.length;
  const userEntry = rankedList[userIndex] || rankedList[0];

  const currentGroupInfo =
    gymGroups.find((g) => g.code === profile.gymCode) || gymGroups[0];

  const handleCopyInvite = async () => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(profile.gymCode);
      showToast(`Código ${profile.gymCode} copiado! Envie para seus amigos!`);
    }
  };

  const handleJoinGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCodeInput.trim()) return;
    joinOrCreateGymGroup(inviteCodeInput, newGroupName);
    setInviteCodeInput("");
    setNewGroupName("");
    setShowGroupModal(false);
  };

  return (
    <div className="space-y-4 pb-44">
      {/* HEADER + FILTROS SEMANAL / GERAL & ACADEMIA / GRUPO */}
      <section className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-[#0E1629] to-slate-950 p-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="inline-flex items-center gap-1 rounded-full bg-neon-lime/15 px-2.5 py-0.5 text-[11px] font-extrabold uppercase text-neon-lime">
              <Trophy className="h-3.5 w-3.5" /> Competição Saudável
            </span>
            <h1 className="mt-1 text-xl font-black text-white">
              Ranking da Academia
            </h1>
          </div>

          <button
            type="button"
            onClick={() => setShowGroupModal(!showGroupModal)}
            className="flex items-center gap-1.5 rounded-2xl border border-neon-lime/40 bg-neon-lime/10 px-3 py-2 text-xs font-extrabold text-neon-lime hover:bg-neon-lime/20"
          >
            <Users className="h-4 w-4" />
            Código: {profile.gymCode}
          </button>
        </div>

        {/* Modal/Gaveta de Código de Convite de Academia ou Amigos */}
        {showGroupModal && (
          <div className="mt-3 rounded-2xl border border-neon-lime/35 bg-slate-950/95 p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase text-neon-lime">
                Grupos & Código de Convite
              </span>
              <button
                type="button"
                onClick={handleCopyInvite}
                className="inline-flex items-center gap-1 rounded-lg bg-slate-800 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-slate-700"
              >
                <Copy className="h-3 w-3 text-neon-lime" /> Copiar Meu Código (
                {profile.gymCode})
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {gymGroups.map((g) => (
                <button
                  key={g.code}
                  type="button"
                  onClick={() => joinOrCreateGymGroup(g.code)}
                  className={`rounded-xl px-2.5 py-1.5 text-xs font-bold transition ${
                    profile.gymCode === g.code
                      ? "bg-neon-lime text-slate-950"
                      : "border border-slate-800 bg-slate-900 text-slate-300"
                  }`}
                >
                  {g.name} ({g.code})
                </button>
              ))}
            </div>

            <form onSubmit={handleJoinGroup} className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <input
                type="text"
                required
                value={inviteCodeInput}
                onChange={(e) => setInviteCodeInput(e.target.value)}
                placeholder="Código (ex: AMIGOS-10)"
                className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs uppercase text-white placeholder-slate-500"
              />
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Nome do Grupo (opcional)"
                className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-500"
              />
              <button
                type="submit"
                className="flex items-center justify-center gap-1 rounded-xl bg-neon-lime py-2 text-xs font-extrabold text-slate-950"
              >
                <Plus className="h-4 w-4 stroke-[3]" /> Entrar / Criar Grupo
              </button>
            </form>
          </div>
        )}

        {/* Seletores Semanal vs Geral e Geral vs Grupo */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="grid grid-cols-2 rounded-2xl border border-slate-800 bg-slate-950 p-1">
            <button
              type="button"
              onClick={() => setPeriod("geral")}
              className={`rounded-xl py-2 text-xs font-extrabold transition ${
                period === "geral"
                  ? "bg-neon-lime text-slate-950"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Ranking Geral
            </button>
            <button
              type="button"
              onClick={() => setPeriod("semanal")}
              className={`rounded-xl py-2 text-xs font-extrabold transition ${
                period === "semanal"
                  ? "bg-neon-lime text-slate-950"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Semanal
            </button>
          </div>

          <div className="grid grid-cols-2 rounded-2xl border border-slate-800 bg-slate-950 p-1">
            <button
              type="button"
              onClick={() => setScope("todos")}
              className={`rounded-xl py-2 text-xs font-extrabold transition ${
                scope === "todos"
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Toda Academia
            </button>
            <button
              type="button"
              onClick={() => setScope("meu_grupo")}
              className={`rounded-xl py-2 text-xs font-extrabold transition ${
                scope === "meu_grupo"
                  ? "bg-slate-800 text-neon-lime"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Grupo ({profile.gymCode})
            </button>
          </div>
        </div>
      </section>

      {/* DESAFIO SEMANAL DA TURMA (EXTRA DE ENGAJAMENTO) */}
      <section className="rounded-3xl border border-orange-500/35 bg-gradient-to-r from-orange-950/35 via-slate-900 to-slate-900 p-3.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-orange-500/20 text-orange-400">
              <Swords className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-orange-400">
                Desafio Ativo — {currentGroupInfo.name}
              </p>
              <p className="text-xs font-extrabold text-white">
                {currentGroupInfo.weeklyChallengeTitle}
              </p>
            </div>
          </div>
          <span className="shrink-0 rounded-xl bg-orange-500/20 px-2.5 py-1 text-xs font-black text-orange-300">
            +{currentGroupInfo.weeklyChallengeReward} pts
          </span>
        </div>
      </section>

      {/* PÓDIO TOP 3 (OURO, PRATA E BRONZE) COM FOTOS */}
      <section className="rounded-3xl border border-slate-800 bg-gradient-to-b from-[#10192E] to-slate-950 px-3 pb-5 pt-6">
        <div className="grid grid-cols-3 items-end gap-2 text-center">
          {/* 2º LUGAR — PRATA */}
          {top2 && (
            <div className="flex flex-col items-center">
              <div className="relative">
                <img
                  src={top2.avatarUrl}
                  alt={top2.name}
                  className="h-16 w-16 rounded-full object-cover ring-4 ring-slate-300"
                />
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-slate-300 px-2 py-0.5 text-[10px] font-black text-slate-950 shadow">
                  2º PRATA
                </span>
              </div>
              <p className="mt-3 w-full truncate text-xs font-extrabold text-white">
                {top2.name}
              </p>
              <p className="text-xs font-black text-slate-300">
                {period === "semanal" ? top2.weeklyPoints : top2.points} pts
              </p>
              <div className="mt-2 flex h-20 w-full flex-col items-center justify-center rounded-t-2xl border-t-2 border-slate-300 bg-gradient-to-b from-slate-400/25 to-slate-900/40">
                <Medal className="h-6 w-6 text-slate-300" />
                <span className="mt-1 text-[10px] font-bold text-slate-300">
                  🔥 {top2.streak}d
                </span>
              </div>
            </div>
          )}

          {/* 1º LUGAR — OURO */}
          {top1 && (
            <div className="flex flex-col items-center">
              <Crown className="mb-1 h-7 w-7 animate-bounce text-amber-400 fill-amber-400" />
              <div className="relative">
                <img
                  src={top1.avatarUrl}
                  alt={top1.name}
                  className="h-20 w-20 rounded-full object-cover ring-4 ring-amber-400 shadow-xl shadow-amber-500/30"
                />
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-2.5 py-0.5 text-[10px] font-black text-slate-950 shadow">
                  1º OURO
                </span>
              </div>
              <p className="mt-3 w-full truncate text-sm font-black text-amber-300">
                {top1.name}
              </p>
              <p className="text-sm font-black text-neon-lime">
                {period === "semanal" ? top1.weeklyPoints : top1.points} pts
              </p>
              <div className="mt-2 flex h-28 w-full flex-col items-center justify-center rounded-t-2xl border-t-2 border-amber-400 bg-gradient-to-b from-amber-500/30 to-slate-900/40">
                <Trophy className="h-7 w-7 text-amber-400" />
                <span className="mt-1 text-[11px] font-extrabold text-amber-200">
                  🔥 {top1.streak} dias
                </span>
              </div>
            </div>
          )}

          {/* 3º LUGAR — BRONZE */}
          {top3 && (
            <div className="flex flex-col items-center">
              <div className="relative">
                <img
                  src={top3.avatarUrl}
                  alt={top3.name}
                  className="h-16 w-16 rounded-full object-cover ring-4 ring-amber-700"
                />
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-amber-700 px-2 py-0.5 text-[10px] font-black text-white shadow">
                  3º BRONZE
                </span>
              </div>
              <p className="mt-3 w-full truncate text-xs font-extrabold text-white">
                {top3.name}
              </p>
              <p className="text-xs font-black text-amber-500">
                {period === "semanal" ? top3.weeklyPoints : top3.points} pts
              </p>
              <div className="mt-2 flex h-16 w-full flex-col items-center justify-center rounded-t-2xl border-t-2 border-amber-700 bg-gradient-to-b from-amber-700/25 to-slate-900/40">
                <Medal className="h-5 w-5 text-amber-600" />
                <span className="mt-0.5 text-[10px] font-bold text-amber-500">
                  🔥 {top3.streak}d
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* LISTA COMPLETA DE ALUNOS NO RANKING */}
      <section className="space-y-2">
        <div className="flex items-center justify-between px-1 text-xs text-slate-400">
          <span className="font-bold uppercase tracking-wider">
            Classificação Completa
          </span>
          <span>Treino = +150pts • Dieta/Água = +30pts</span>
        </div>

        {rankedList.map((comp, idx) => {
          const pos = idx + 1;
          const pts = period === "semanal" ? comp.weeklyPoints : comp.points;

          return (
            <div
              key={comp.id}
              className={`flex items-center justify-between gap-3 rounded-2xl border p-3 transition ${
                comp.isCurrentUser
                  ? "border-neon-lime bg-neon-lime/15 shadow-lg shadow-neon-lime/10"
                  : "border-slate-800/90 bg-slate-900/75"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-black ${
                    pos === 1
                      ? "bg-amber-400 text-slate-950"
                      : pos === 2
                      ? "bg-slate-300 text-slate-950"
                      : pos === 3
                      ? "bg-amber-700 text-white"
                      : comp.isCurrentUser
                      ? "bg-neon-lime text-slate-950"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {pos}º
                </span>

                <img
                  src={comp.avatarUrl}
                  alt={comp.name}
                  className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-slate-700"
                />

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-sm font-extrabold text-white">
                      {comp.name}
                    </p>
                    {comp.isCurrentUser && (
                      <span className="rounded-md bg-neon-lime px-1.5 py-0.2 text-[9px] font-black uppercase text-slate-950">
                        VOCÊ
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="flex items-center gap-0.5 text-orange-400 font-bold">
                      <Flame className="h-3 w-3 fill-orange-400" /> {comp.streak}d
                    </span>
                    <span>•</span>
                    <span>{comp.workoutsCount} treinos</span>
                    <span>•</span>
                    <span className="truncate text-slate-300">{comp.badge}</span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className="text-base font-black text-neon-lime">{pts}</p>
                <p className="text-[10px] font-bold uppercase text-slate-400">
                  pontos
                </p>
              </div>
            </div>
          );
        })}
      </section>

      {/* BARRA FIXA: POSIÇÃO DO USUÁRIO SEMPRE VISÍVEL (MESMO FORA DO TOP 10) */}
      <div className="fixed bottom-16 left-1/2 z-30 w-full max-w-[480px] -translate-x-1/2 px-3 pb-1">
        <div className="flex items-center justify-between rounded-2xl border-2 border-neon-lime bg-slate-950/95 px-4 py-2.5 shadow-2xl shadow-black backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-neon-lime text-sm font-black text-slate-950">
              #{userPosition}
            </span>
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="h-10 w-10 rounded-full object-cover ring-2 ring-neon-lime"
            />
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-neon-lime">
                Sua Posição Atual
              </p>
              <p className="text-sm font-black text-white">{profile.name}</p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-lg font-black text-white">
              {period === "semanal"
                ? userEntry.weeklyPoints
                : userEntry.points}{" "}
              <span className="text-xs text-neon-lime">pts</span>
            </p>
            <p className="text-[10px] font-bold text-orange-400">
              🔥 Sequência de {profile.currentStreak} dias
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
