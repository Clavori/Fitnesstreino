"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  AlertCircle,
  Check,
  Clock,
  Droplets,
  Flame,
  Plus,
  Salad,
  Utensils,
} from "lucide-react";

export const NutritionTab: React.FC = () => {
  const {
    profile,
    nutrition,
    nutritionTargets,
    nutritionConsumed,
    toggleMealChecked,
    addWaterMl,
    addCustomFood,
  } = useApp();

  const [showAddFood, setShowAddFood] = useState(false);
  const [foodName, setFoodName] = useState("");
  const [foodCalories, setFoodCalories] = useState(250);
  const [foodProtein, setFoodProtein] = useState(25);
  const [foodCarbs, setFoodCarbs] = useState(20);
  const [foodFat, setFoodFat] = useState(6);

  const handleAddFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName.trim()) return;
    addCustomFood({
      name: foodName.trim(),
      calories: Number(foodCalories) || 0,
      proteinG: Number(foodProtein) || 0,
      carbsG: Number(foodCarbs) || 0,
      fatG: Number(foodFat) || 0,
    });
    setFoodName("");
    setShowAddFood(false);
  };

  const calPct = Math.min(
    100,
    Math.round((nutritionConsumed.calories / nutritionTargets.calories) * 100)
  );
  const protPct = Math.min(
    100,
    Math.round((nutritionConsumed.proteinG / nutritionTargets.proteinG) * 100)
  );
  const carbPct = Math.min(
    100,
    Math.round((nutritionConsumed.carbsG / nutritionTargets.carbsG) * 100)
  );
  const fatPct = Math.min(
    100,
    Math.round((nutritionConsumed.fatG / nutritionTargets.fatG) * 100)
  );
  const waterPct = Math.min(
    100,
    Math.round((nutrition.waterMl / nutritionTargets.waterTargetMl) * 100)
  );

  return (
    <div className="space-y-4 pb-28">
      {/* AVISO NUTRICIONAL OBRIGATÓRIO */}
      <div className="flex items-start gap-2.5 rounded-2xl border border-amber-500/35 bg-amber-950/25 p-3.5 text-xs text-amber-200">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
        <p className="leading-relaxed">
          <strong>Aviso importante:</strong> Os planos alimentares e metas de
          macronutrientes abaixo são <strong>sugestões educativas gerais</strong>{" "}
          calculadas com base no seu peso ({profile.weightKg}kg), altura (
          {profile.heightCm}cm) e objetivo, e{" "}
          <strong>não substituem a prescrição individual de um nutricionista</strong>.
        </p>
      </div>

      {/* PAINEL DE METAS DIÁRIAS (CALORIAS + MACROS) */}
      <section className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-[#0E1629] to-slate-950 p-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <span className="inline-flex items-center gap-1 rounded-full bg-neon-lime/15 px-2.5 py-0.5 text-[11px] font-extrabold uppercase text-neon-lime">
              <Salad className="h-3.5 w-3.5" /> Meta para{" "}
              {profile.goal === "emagrecer"
                ? "Emagrecer Definindo"
                : profile.goal === "ganhar_massa"
                ? "Ganhar Massa Magra"
                : "Manter o Shape"}
            </span>
            <h1 className="mt-1.5 text-xl font-black text-white">
              Metas Diárias de Nutrição
            </h1>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400">Balanço Calórico</span>
            <p className="text-lg font-black text-neon-lime">{calPct}%</p>
          </div>
        </div>

        {/* Barra Principal de Calorias */}
        <div className="mt-4 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-3.5">
          <div className="flex items-baseline justify-between">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase text-slate-300">
              <Flame className="h-4 w-4 text-orange-400" /> Calorias Consumidas
            </span>
            <span className="text-base font-black text-white">
              {nutritionConsumed.calories}{" "}
              <span className="text-xs font-normal text-slate-400">
                / {nutritionTargets.calories} kcal
              </span>
            </span>
          </div>
          <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-orange-500 to-neon-lime transition-all duration-300"
              style={{ width: `${calPct}%` }}
            />
          </div>
        </div>

        {/* Barras de Proteínas, Carboidratos e Gorduras */}
        <div className="mt-3 grid grid-cols-3 gap-2.5">
          {/* Proteínas */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
            <p className="text-[10px] font-bold uppercase text-emerald-400">
              Proteínas
            </p>
            <p className="mt-1 text-sm font-black text-white">
              {nutritionConsumed.proteinG}g{" "}
              <span className="text-[10px] font-normal text-slate-400">
                / {nutritionTargets.proteinG}g
              </span>
            </p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-emerald-400 transition-all"
                style={{ width: `${protPct}%` }}
              />
            </div>
          </div>

          {/* Carboidratos */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
            <p className="text-[10px] font-bold uppercase text-amber-400">
              Carboidratos
            </p>
            <p className="mt-1 text-sm font-black text-white">
              {nutritionConsumed.carbsG}g{" "}
              <span className="text-[10px] font-normal text-slate-400">
                / {nutritionTargets.carbsG}g
              </span>
            </p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-amber-400 transition-all"
                style={{ width: `${carbPct}%` }}
              />
            </div>
          </div>

          {/* Gorduras Boas */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
            <p className="text-[10px] font-bold uppercase text-rose-400">
              Gorduras
            </p>
            <p className="mt-1 text-sm font-black text-white">
              {nutritionConsumed.fatG}g{" "}
              <span className="text-[10px] font-normal text-slate-400">
                / {nutritionTargets.fatG}g
              </span>
            </p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-rose-400 transition-all"
                style={{ width: `${fatPct}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* LEMBRETE E META DE HIDRATAÇÃO (ÁGUA) */}
      <section className="rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/35 via-slate-900 to-slate-900 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400">
              <Droplets className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white">
                Meta de Hidratação Diária
              </h2>
              <p className="text-[11px] text-slate-400">
                Ideal p/ {profile.weightKg}kg:{" "}
                <strong className="text-cyan-300">
                  {(nutritionTargets.waterTargetMl / 1000).toFixed(1)} Litros
                </strong>
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-black text-cyan-300">
              {nutrition.waterMl} ml
            </p>
            <p className="text-[10px] font-bold text-slate-400">
              {waterPct}% concluído
            </p>
          </div>
        </div>

        <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-sky-300 transition-all"
            style={{ width: `${waterPct}%` }}
          />
        </div>

        <div className="mt-3 grid grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => addWaterMl(-250)}
            className="rounded-xl border border-slate-700 bg-slate-800/80 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700"
          >
            -250ml
          </button>
          <button
            type="button"
            onClick={() => addWaterMl(250)}
            className="rounded-xl bg-cyan-500/20 py-2 text-xs font-extrabold text-cyan-300 hover:bg-cyan-500/30"
          >
            +250ml (Copo)
          </button>
          <button
            type="button"
            onClick={() => addWaterMl(500)}
            className="rounded-xl bg-cyan-500/20 py-2 text-xs font-extrabold text-cyan-300 hover:bg-cyan-500/30"
          >
            +500ml (Garrafa)
          </button>
          <button
            type="button"
            onClick={() => addWaterMl(750)}
            className="rounded-xl bg-cyan-400 py-2 text-xs font-black text-slate-950 hover:brightness-110"
          >
            +750ml (Shaker)
          </button>
        </div>
      </section>

      {/* PLANO ALIMENTAR DIÁRIO SUGERIDO (5 REFEIÇÕES) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-300">
            Plano Alimentar do Dia (Toque p/ Registrar)
          </h2>
          <button
            type="button"
            onClick={() => setShowAddFood(!showAddFood)}
            className="inline-flex items-center gap-1 rounded-xl border border-neon-lime/40 bg-neon-lime/10 px-2.5 py-1.5 text-xs font-extrabold text-neon-lime hover:bg-neon-lime/20"
          >
            <Plus className="h-3.5 w-3.5" /> Registrar Alimento Extra
          </button>
        </div>

        {/* Formulário de Registro Simples do que Comeu */}
        {showAddFood && (
          <form
            onSubmit={handleAddFood}
            className="rounded-2xl border border-neon-lime/40 bg-slate-900 p-4 space-y-3"
          >
            <p className="text-xs font-extrabold uppercase tracking-wider text-neon-lime">
              Adicionar Alimento ou Refeição Livre
            </p>
            <div>
              <label className="block text-[11px] font-semibold text-slate-300">
                O que você comeu?
              </label>
              <input
                type="text"
                required
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                placeholder="Ex: Omelete de 3 ovos + 1 fruta, Barra de proteína..."
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-neon-lime focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-4 gap-2">
              <div>
                <label className="block text-[10px] text-slate-400">
                  Calorias (kcal)
                </label>
                <input
                  type="number"
                  value={foodCalories}
                  onChange={(e) => setFoodCalories(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 p-1.5 text-center text-xs font-bold text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] text-emerald-400">
                  Proteína (g)
                </label>
                <input
                  type="number"
                  value={foodProtein}
                  onChange={(e) => setFoodProtein(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 p-1.5 text-center text-xs font-bold text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] text-amber-400">
                  Carbo (g)
                </label>
                <input
                  type="number"
                  value={foodCarbs}
                  onChange={(e) => setFoodCarbs(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 p-1.5 text-center text-xs font-bold text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] text-rose-400">
                  Gordura (g)
                </label>
                <input
                  type="number"
                  value={foodFat}
                  onChange={(e) => setFoodFat(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 p-1.5 text-center text-xs font-bold text-white"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 rounded-xl bg-neon-lime py-2.5 text-xs font-extrabold text-slate-950"
              >
                Salvar no Diário
              </button>
              <button
                type="button"
                onClick={() => setShowAddFood(false)}
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-300"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        {/* Cards das 5 Refeições (Café, Almoço, Lanche, Jantar, Ceia) */}
        {nutrition.meals.map((meal) => (
          <div
            key={meal.id}
            className={`rounded-3xl border p-4 transition ${
              meal.checked
                ? "border-emerald-500/45 bg-emerald-950/15"
                : "border-slate-800 bg-slate-900/75"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-lg bg-slate-800 px-2 py-0.5 text-[11px] font-bold text-neon-lime">
                    <Clock className="h-3 w-3" /> {meal.time}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    {meal.calories} kcal • {meal.proteinG}g Prot
                  </span>
                </div>
                <h3 className="mt-1.5 text-base font-extrabold text-white">
                  {meal.title}
                </h3>
                <p className="text-[11px] text-slate-400">{meal.description}</p>
              </div>

              <button
                type="button"
                onClick={() => toggleMealChecked(meal.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-2xl px-3.5 py-2.5 text-xs font-extrabold transition ${
                  meal.checked
                    ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
                    : "border border-slate-700 bg-slate-800 text-slate-200 hover:border-neon-lime"
                }`}
              >
                <Check className="h-4 w-4 stroke-[3]" />
                {meal.checked ? "Consumido" : "Marcar"}
              </button>
            </div>

            <ul className="mt-3 space-y-1 border-t border-slate-800/80 pt-2.5 text-xs text-slate-200">
              {meal.items.map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Utensils className="h-3 w-3 shrink-0 text-neon-lime" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Alimentos extras registrados pelo aluno */}
        {nutrition.customFoods.length > 0 && (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-neon-lime">
              Alimentos Extras Registrados Hoje
            </h3>
            <div className="mt-2.5 space-y-2">
              {nutrition.customFoods.map((f) => (
                <div
                  key={f.id}
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs"
                >
                  <div>
                    <p className="font-bold text-white">{f.name}</p>
                    <p className="text-[10px] text-slate-400">às {f.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-neon-lime">{f.calories} kcal</p>
                    <p className="text-[10px] text-slate-400">
                      P: {f.proteinG}g | C: {f.carbsG}g | G: {f.fatG}g
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
