"use client";

import React, { useMemo, useState } from "react";
import { getTodayIso, useApp } from "@/context/AppContext";
import { AttendanceStatus } from "@/types/fitness";
import {
  CalendarCheck,
  Check,
  Coffee,
  Flame,
  Sparkles,
  Trophy,
  XCircle,
} from "lucide-react";

const WEEKDAYS_HEADER = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];

export const CalendarTab: React.FC = () => {
  const { profile, attendance, markManualAttendance } = useApp();

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const todayIso = getTodayIso();

  const [selectedIso, setSelectedIso] = useState<string>(todayIso);

  // Construção dos dias do mês atual
  const calendarDays = useMemo(() => {
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: {
      dayNum: number | null;
      iso: string | null;
    }[] = [];

    for (let i = 0; i < firstDayOfWeek; i++) {
      cells.push({ dayNum: null, iso: null });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(
        d
      ).padStart(2, "0")}`;
      cells.push({ dayNum: d, iso });
    }

    return cells;
  }, [year, month]);

  const monthName = new Date(year, month, 1).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  // Estatísticas do mês
  const stats = useMemo(() => {
    const values = Object.values(attendance);
    const trained = values.filter((v) => v.status === "trained").length;
    const rest = values.filter((v) => v.status === "rest").length;
    const missed = values.filter((v) => v.status === "missed").length;
    const totalTracked = trained + missed;
    const consistency =
      totalTracked > 0 ? Math.round((trained / totalTracked) * 100) : 100;
    return { trained, rest, missed, consistency };
  }, [attendance]);

  const selectedRecord = attendance[selectedIso];

  const handleSetStatus = (status: AttendanceStatus) => {
    markManualAttendance(selectedIso, status);
  };

  return (
    <div className="space-y-4 pb-28">
      {/* BANNER DE STREAK (SEQUÊNCIA DE DIAS SEGUIDOS) */}
      <section className="rounded-3xl border border-orange-500/35 bg-gradient-to-br from-orange-950/40 via-slate-900 to-slate-950 p-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 text-slate-950 shadow-lg shadow-orange-500/30">
              <Flame className="h-8 w-8 fill-slate-950" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-400">
                Sequência Implacável (Streak)
              </span>
              <h1 className="text-2xl font-black text-white">
                {profile.currentStreak} Dias Seguidos
              </h1>
              <p className="text-xs text-slate-400">
                Recorde pessoal:{" "}
                <strong className="text-white">
                  {profile.bestStreak} dias
                </strong>
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/75 px-3.5 py-2 text-center">
            <span className="text-[10px] font-bold uppercase text-slate-400">
              Constância
            </span>
            <p className="text-xl font-black text-neon-lime">
              {stats.consistency}%
            </p>
          </div>
        </div>

        {/* Mini Resumo do Mês */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-2.5 text-center">
            <p className="text-lg font-black text-emerald-400">
              {stats.trained}
            </p>
            <p className="text-[10px] font-bold uppercase text-slate-300">
              ✅ Dias Treinados
            </p>
          </div>
          <div className="rounded-2xl border border-sky-500/30 bg-sky-950/20 p-2.5 text-center">
            <p className="text-lg font-black text-sky-400">{stats.rest}</p>
            <p className="text-[10px] font-bold uppercase text-slate-300">
              💤 Descansos
            </p>
          </div>
          <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-2.5 text-center">
            <p className="text-lg font-black text-rose-400">{stats.missed}</p>
            <p className="text-[10px] font-bold uppercase text-slate-300">
              ❌ Faltas
            </p>
          </div>
        </div>
      </section>

      {/* CALENDÁRIO MENSAL INTERATIVO */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base font-black capitalize text-white">
              {monthName}
            </h2>
            <p className="text-[11px] text-slate-400">
              Toque em qualquer dia para ver detalhes ou fazer check-in manual
            </p>
          </div>
          <CalendarCheck className="h-5 w-5 text-neon-lime" />
        </div>

        {/* Cabeçalho dos dias da semana */}
        <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-extrabold text-slate-400">
          {WEEKDAYS_HEADER.map((w) => (
            <div key={w} className="py-1">
              {w}
            </div>
          ))}
        </div>

        {/* Grade de dias */}
        <div className="mt-1 grid grid-cols-7 gap-1.5">
          {calendarDays.map((cell, idx) => {
            if (!cell.dayNum || !cell.iso) {
              return <div key={`empty-${idx}`} className="h-11 rounded-xl" />;
            }

            const rec = attendance[cell.iso];
            const isSelected = selectedIso === cell.iso;
            const isToday = cell.iso === todayIso;

            let bgClass =
              "border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700";
            if (rec?.status === "trained") {
              bgClass =
                "border-emerald-400/60 bg-emerald-500/20 text-emerald-300 font-black";
            } else if (rec?.status === "rest") {
              bgClass =
                "border-sky-400/40 bg-sky-500/15 text-sky-300 font-bold";
            } else if (rec?.status === "missed") {
              bgClass =
                "border-rose-500/40 bg-rose-500/15 text-rose-300 font-bold";
            }

            return (
              <button
                key={cell.iso}
                type="button"
                onClick={() => setSelectedIso(cell.iso!)}
                className={`relative flex h-11 flex-col items-center justify-center rounded-xl border text-xs transition ${bgClass} ${
                  isSelected ? "ring-2 ring-neon-lime ring-offset-1 ring-offset-slate-950" : ""
                }`}
              >
                <span>{cell.dayNum}</span>
                {rec?.status === "trained" && (
                  <span className="mt-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-400 text-[9px] font-black text-slate-950">
                    ✓
                  </span>
                )}
                {rec?.status === "rest" && (
                  <span className="mt-0.5 text-[9px] leading-none">💤</span>
                )}
                {rec?.status === "missed" && (
                  <span className="mt-0.5 text-[9px] leading-none text-rose-400">
                    ✕
                  </span>
                )}
                {isToday && !rec && (
                  <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-neon-lime" />
                )}
              </button>
            );
          })}
        </div>

        {/* Legenda de Cores */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 border-t border-slate-800 pt-3 text-[11px] text-slate-300">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-emerald-400" /> Treinado
            (Check Verde)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-sky-400" /> Descanso
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-rose-400" /> Falta
          </span>
        </div>
      </section>

      {/* PAINEL DE CHECK-IN MANUAL OU DETALHES DO DIA SELECIONADO */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-neon-lime">
              Dia Selecionado: {selectedIso.split("-").reverse().join("/")}
            </span>
            <h3 className="mt-0.5 text-base font-black text-white">
              {selectedRecord
                ? selectedRecord.workoutTitle
                : "Sem registro neste dia"}
            </h3>
            {selectedRecord && (
              <p className="text-xs text-slate-400">
                Origem:{" "}
                {selectedRecord.source === "auto"
                  ? "Check-in Automático ao finalizar treino"
                  : "Marcado manualmente pelo aluno"}{" "}
                {selectedRecord.pointsAwarded
                  ? `• +${selectedRecord.pointsAwarded} pts`
                  : ""}
              </p>
            )}
          </div>
          {selectedRecord?.status === "trained" && (
            <span className="inline-flex items-center gap-1 rounded-xl bg-emerald-500/20 px-2.5 py-1 text-xs font-extrabold text-emerald-400">
              <Trophy className="h-3.5 w-3.5" /> +150 pts
            </span>
          )}
        </div>

        <p className="mt-3 text-xs font-bold text-slate-300">
          Check-in Manual / Alterar Status do Dia:
        </p>
        <div className="mt-2 grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleSetStatus("trained")}
            className="flex items-center justify-center gap-1.5 rounded-2xl bg-emerald-500 py-3 text-xs font-extrabold text-slate-950 shadow-lg shadow-emerald-500/20 hover:brightness-110"
          >
            <Check className="h-4 w-4 stroke-[3]" />
            Treinei (+150)
          </button>
          <button
            type="button"
            onClick={() => handleSetStatus("rest")}
            className="flex items-center justify-center gap-1.5 rounded-2xl border border-sky-500/40 bg-sky-500/15 py-3 text-xs font-extrabold text-sky-300 hover:bg-sky-500/25"
          >
            <Coffee className="h-4 w-4" />
            Descanso
          </button>
          <button
            type="button"
            onClick={() => handleSetStatus("missed")}
            className="flex items-center justify-center gap-1.5 rounded-2xl border border-rose-500/40 bg-rose-500/15 py-3 text-xs font-extrabold text-rose-300 hover:bg-rose-500/25"
          >
            <XCircle className="h-4 w-4" />
            Faltei
          </button>
        </div>

        <p className="mt-2.5 flex items-center gap-1.5 text-[11px] text-slate-400">
          <Sparkles className="h-3.5 w-3.5 text-neon-lime" />
          Dica: Ao clicar em &ldquo;Finalizar Treino&rdquo; na tela inicial, o
          check-in verde é feito automaticamente!
        </p>
      </section>
    </div>
  );
};
