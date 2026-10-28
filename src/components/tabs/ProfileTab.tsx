"use client";

import React, { useRef, useState } from "react";
import { useApp } from "@/context/AppContext";
import { ExperienceLevel, FitnessGoal } from "@/types/fitness";
import {
  Award,
  Camera,
  CheckCircle2,
  ClipboardList,
  LogIn,
  LogOut,
  Mail,
  Save,
  Scale,
  ShieldCheck,
  TrendingUp,
  UserCheck,
} from "lucide-react";

export const ProfileTab: React.FC = () => {
  const {
    isAuthenticated,
    loginWithEmail,
    loginWithGoogle,
    logout,
    profile,
    updateProfile,
    achievements,
    bodyWeightHistory,
    addBodyWeightEntry,
    applyInstructorPreset,
  } = useApp();

  // Estado local do formulário de perfil
  const [name, setName] = useState(profile.name);
  const [age, setAge] = useState(profile.age);
  const [weightKg, setWeightKg] = useState(profile.weightKg);
  const [heightCm, setHeightCm] = useState(profile.heightCm);
  const [goal, setGoal] = useState<FitnessGoal>(profile.goal);
  const [level, setLevel] = useState<ExperienceLevel>(profile.level);
  const [recalcOnSave, setRecalcOnSave] = useState(true);

  // Estado de Login / Cadastro
  const [authEmail, setAuthEmail] = useState(profile.email);
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Estado de Registro de Peso e Medidas
  const [newWeight, setNewWeight] = useState(profile.weightKg);
  const [newWaist, setNewWaist] = useState(81);
  const [newArm, setNewArm] = useState(39);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        updateProfile({ avatarUrl: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(
      {
        name,
        age: Number(age),
        weightKg: Number(weightKg),
        heightCm: Number(heightCm),
        goal,
        level,
      },
      recalcOnSave
    );
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginWithEmail(authEmail, isRegisterMode ? authName : undefined);
  };

  // Cálculo rápido de IMC
  const bmi = (
    profile.weightKg / Math.pow(profile.heightCm / 100, 2)
  ).toFixed(1);

  return (
    <div className="space-y-4 pb-28">
      {/* SEÇÃO 1: AUTENTICAÇÃO (LOGIN / CADASTRO / GOOGLE) */}
      {!isAuthenticated ? (
        <section className="rounded-3xl border border-neon-lime/40 bg-gradient-to-br from-slate-900 via-[#0E1629] to-slate-950 p-5 shadow-2xl">
          <div className="text-center">
            <span className="inline-flex items-center gap-1 rounded-full bg-neon-lime/15 px-3 py-1 text-xs font-extrabold uppercase text-neon-lime">
              <ShieldCheck className="h-4 w-4" /> Conta FORJA (Supabase Auth)
            </span>
            <h1 className="mt-2 text-2xl font-black text-white">
              {isRegisterMode ? "Criar Conta de Aluno" : "Entrar na sua Conta"}
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Sincronize seus treinos, dieta, fotos e posição no ranking em
              qualquer celular.
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="mt-4 space-y-3">
            {isRegisterMode && (
              <div>
                <label className="block text-xs font-bold text-slate-300">
                  Seu Nome Completo
                </label>
                <input
                  type="text"
                  required
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  placeholder="Ex: Lucas Andrade"
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-neon-lime focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300">
                E-mail
              </label>
              <input
                type="email"
                required
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="seuemail@exemplo.com"
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-neon-lime focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300">
                Senha
              </label>
              <input
                type="password"
                required
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-neon-lime focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-neon-lime py-3.5 text-xs font-black uppercase text-slate-950 shadow-lg shadow-neon-lime/25 hover:brightness-110"
            >
              <LogIn className="h-4 w-4" />
              {isRegisterMode ? "Finalizar Cadastro" : "Entrar com E-mail"}
            </button>
          </form>

          <div className="my-3 flex items-center gap-2">
            <div className="h-px flex-1 bg-slate-800" />
            <span className="text-[10px] font-bold uppercase text-slate-500">
              ou continue com
            </span>
            <div className="h-px flex-1 bg-slate-800" />
          </div>

          <button
            type="button"
            onClick={loginWithGoogle}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-white py-3 text-xs font-extrabold text-slate-900 hover:bg-slate-100"
          >
            <Mail className="h-4 w-4 text-rose-500" />
            Continuar com Google
          </button>

          <p className="mt-4 text-center text-xs text-slate-400">
            {isRegisterMode ? "Já possui conta?" : "Ainda não é aluno?"}{" "}
            <button
              type="button"
              onClick={() => setIsRegisterMode(!isRegisterMode)}
              className="font-extrabold text-neon-lime underline"
            >
              {isRegisterMode ? "Fazer Login" : "Cadastre-se grátis"}
            </button>
          </p>
        </section>
      ) : (
        /* CABEÇALHO DO PERFIL COM FOTO (UPLOAD OU CÂMERA) */
        <section className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-[#0E1629] to-slate-950 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="h-20 w-20 rounded-3xl object-cover ring-2 ring-neon-lime"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1.5 -right-1.5 flex h-8 w-8 items-center justify-center rounded-xl bg-neon-lime text-slate-950 shadow-lg hover:brightness-110"
                  title="Trocar foto de perfil (Upload ou Câmera)"
                >
                  <Camera className="h-4 w-4 stroke-[2.5]" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="user"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>

              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" /> Conta Ativa
                </span>
                <h1 className="mt-1 text-xl font-black text-white">
                  {profile.name}
                </h1>
                <p className="text-xs text-slate-400">{profile.email}</p>
                <p className="mt-1 text-[11px] font-bold text-neon-lime">
                  IMC: {bmi} • Grupo: {profile.gymCode}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              className="rounded-2xl border border-slate-700 bg-slate-800/80 p-2.5 text-slate-300 hover:border-rose-500/40 hover:text-rose-400"
              title="Sair da conta"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </section>
      )}

      {/* SEÇÃO 2: FORMULÁRIO DE DADOS FÍSICOS, OBJETIVO E NÍVEL */}
      <form
        onSubmit={handleSaveProfile}
        className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 space-y-3.5"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black uppercase tracking-wider text-white">
            Dados do Aluno, Objetivo & Nível
          </h2>
          <span className="text-[11px] text-neon-lime font-semibold">
            Personaliza Treino + Dieta
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-[11px] font-bold text-slate-300">
              Nome de Exibição no Ranking
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-bold text-white focus:border-neon-lime focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-300">
                Idade
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-2 py-2 text-center text-xs font-bold text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-300">
                Peso (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-2 py-2 text-center text-xs font-bold text-neon-lime"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-300">
                Altura (cm)
              </label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-2 py-2 text-center text-xs font-bold text-white"
              />
            </div>
          </div>
        </div>

        {/* Seleção de Objetivo */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Qual o seu objetivo principal?
          </label>
          <div className="mt-1.5 grid grid-cols-3 gap-2">
            {(
              [
                { id: "emagrecer", label: "🔥 Emagrecer" },
                { id: "ganhar_massa", label: "💪 Ganhar Massa" },
                { id: "manter_shape", label: "⚡ Manter Shape" },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setGoal(item.id)}
                className={`rounded-xl border py-2.5 text-xs font-extrabold transition ${
                  goal === item.id
                    ? "border-neon-lime bg-neon-lime text-slate-950"
                    : "border-slate-700 bg-slate-950 text-slate-300"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Seleção de Nível de Experiência */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Nível de Treino Atual
          </label>
          <div className="mt-1.5 grid grid-cols-3 gap-2">
            {(
              [
                { id: "iniciante", label: "🌱 Iniciante" },
                { id: "intermediario", label: "🏋️ Intermediário" },
                { id: "avancado", label: "👑 Avançado" },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setLevel(item.id)}
                className={`rounded-xl border py-2.5 text-xs font-extrabold transition ${
                  level === item.id
                    ? "border-neon-lime bg-neon-lime/20 text-neon-lime"
                    : "border-slate-700 bg-slate-950 text-slate-300"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2 text-xs text-slate-300">
          <input
            type="checkbox"
            checked={recalcOnSave}
            onChange={(e) => setRecalcOnSave(e.target.checked)}
            className="h-4 w-4 rounded accent-neon-lime"
          />
          Recalcular ficha semanal e dieta automaticamente ao salvar
        </label>

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-neon-lime py-3.5 text-xs font-black uppercase text-slate-950 shadow-lg shadow-neon-lime/20 hover:brightness-110"
        >
          <Save className="h-4 w-4" />
          Salvar Perfil & Atualizar Metas
        </button>
      </form>

      {/* SEÇÃO 3: EXTRA — MEDALHAS E CONQUISTAS GAMIFICADAS */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-neon-lime">
            <Award className="h-4 w-4" /> Conquistas & Medalhas Desbloqueadas
          </span>
          <span className="text-xs font-bold text-slate-400">
            {achievements.filter((a) => a.unlocked).length}/
            {achievements.length} completas
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {achievements.map((badge) => (
            <div
              key={badge.id}
              className={`flex items-start gap-3 rounded-2xl border p-3 ${
                badge.unlocked
                  ? "border-neon-lime/40 bg-neon-lime/10"
                  : "border-slate-800 bg-slate-950/60 opacity-75"
              }`}
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-2xl">
                {badge.icon}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="truncate text-xs font-extrabold text-white">
                    {badge.title}
                  </p>
                  <span className="text-[10px] font-black text-neon-lime">
                    +{badge.pointsReward}pts
                  </span>
                </div>
                <p className="mt-0.5 text-[11px] text-slate-300">
                  {badge.description}
                </p>
                <p className="mt-1 text-[10px] font-bold text-emerald-400">
                  {badge.unlocked ? "✓ Desbloqueada!" : badge.progressText}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SEÇÃO 4: EXTRA — EVOLUÇÃO DE PESO E MEDIDAS CORPORAIS */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-cyan-400">
            <TrendingUp className="h-4 w-4" /> Evolução Corporal (Peso & Medidas)
          </span>
          <Scale className="h-4 w-4 text-slate-400" />
        </div>

        <div className="mt-3 flex h-28 items-end justify-between gap-2 rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
          {bodyWeightHistory.map((item, idx) => {
            const minW = Math.min(...bodyWeightHistory.map((b) => b.weightKg)) - 2;
            const maxW = Math.max(...bodyWeightHistory.map((b) => b.weightKg)) + 1;
            const pct = Math.max(
              25,
              Math.min(100, Math.round(((item.weightKg - minW) / (maxW - minW || 1)) * 100))
            );
            return (
              <div key={idx} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-[10px] font-extrabold text-cyan-300">
                  {item.weightKg}kg
                </span>
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-cyan-600 to-neon-lime"
                  style={{ height: `${pct}%` }}
                />
                <span className="text-[10px] text-slate-400">{item.date}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-3 grid grid-cols-4 gap-2">
          <input
            type="number"
            step="0.1"
            value={newWeight}
            onChange={(e) => setNewWeight(Number(e.target.value))}
            placeholder="Peso (kg)"
            className="rounded-xl border border-slate-700 bg-slate-950 p-2 text-center text-xs font-bold text-white"
          />
          <input
            type="number"
            value={newWaist}
            onChange={(e) => setNewWaist(Number(e.target.value))}
            placeholder="Cintura (cm)"
            className="rounded-xl border border-slate-700 bg-slate-950 p-2 text-center text-xs font-bold text-white"
          />
          <input
            type="number"
            value={newArm}
            onChange={(e) => setNewArm(Number(e.target.value))}
            placeholder="Braço (cm)"
            className="rounded-xl border border-slate-700 bg-slate-950 p-2 text-center text-xs font-bold text-white"
          />
          <button
            type="button"
            onClick={() => addBodyWeightEntry(newWeight, newWaist, newArm)}
            className="rounded-xl bg-cyan-400 py-2 text-xs font-black text-slate-950 hover:brightness-110"
          >
            + Registrar
          </button>
        </div>
      </section>

      {/* SEÇÃO 5: EXTRA — PAINEL DO PERSONAL / INSTRUTOR */}
      <section className="rounded-3xl border border-purple-500/35 bg-gradient-to-br from-purple-950/30 via-slate-900 to-slate-950 p-4">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-purple-400" />
          <div>
            <h2 className="text-sm font-black uppercase tracking-wider text-purple-300">
              Painel Rápido do Personal / Instrutor
            </h2>
            <p className="text-[11px] text-slate-400">
              Atribua protocolos prontos de periodização ao aluno com 1 clique:
            </p>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => applyInstructorPreset("push_pull_legs")}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-purple-500/40 bg-purple-500/15 py-2.5 px-3 text-xs font-bold text-purple-200 hover:bg-purple-500/25"
          >
            <UserCheck className="h-4 w-4" /> Push / Pull / Legs Pro
          </button>
          <button
            type="button"
            onClick={() => applyInstructorPreset("hiit_definicao")}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-purple-500/40 bg-purple-500/15 py-2.5 px-3 text-xs font-bold text-purple-200 hover:bg-purple-500/25"
          >
            <UserCheck className="h-4 w-4" /> Cutting & Definição
          </button>
          <button
            type="button"
            onClick={() => applyInstructorPreset("adaptacao")}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-purple-500/40 bg-purple-500/15 py-2.5 px-3 text-xs font-bold text-purple-200 hover:bg-purple-500/25"
          >
            <UserCheck className="h-4 w-4" /> Adaptação Funcional
          </button>
        </div>
      </section>
    </div>
  );
};
