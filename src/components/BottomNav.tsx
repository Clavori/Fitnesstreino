"use client";

import React from "react";
import { ActiveTab, useApp } from "@/context/AppContext";
import {
  CalendarCheck2,
  Dumbbell,
  Home,
  Salad,
  Trophy,
  User,
} from "lucide-react";

const NAV_ITEMS: { id: ActiveTab; label: string; icon: React.ElementType }[] = [
  { id: "inicio", label: "Início", icon: Home },
  { id: "treino", label: "Treino", icon: Dumbbell },
  { id: "alimentacao", label: "Alimentação", icon: Salad },
  { id: "calendario", label: "Calendário", icon: CalendarCheck2 },
  { id: "ranking", label: "Ranking", icon: Trophy },
  { id: "perfil", label: "Perfil", icon: User },
];

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  return (
    <nav
      aria-label="Navegação Principal"
      className="fixed bottom-0 left-1/2 z-40 w-full max-w-[480px] -translate-x-1/2 border-t border-slate-800/90 bg-[#070A12]/95 px-1.5 py-1.5 backdrop-blur-lg"
    >
      <div className="grid grid-cols-6 gap-0.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center rounded-xl py-1.5 transition-all ${
                isActive
                  ? "bg-neon-lime/15 text-neon-lime"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Icon
                className={`h-5 w-5 transition-transform ${
                  isActive ? "scale-110 stroke-[2.5]" : "stroke-[1.8]"
                }`}
              />
              <span
                className={`mt-1 text-[10px] leading-none ${
                  isActive ? "font-extrabold text-neon-lime" : "font-medium"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
