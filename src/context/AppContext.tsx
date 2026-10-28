"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  AchievementBadge,
  AttendanceRecord,
  AttendanceStatus,
  BodyWeightEntry,
  CompetitorRank,
  CustomFoodItem,
  DailyNutritionState,
  DailyWorkoutPlan,
  ExerciseCatalogItem,
  ExperienceLevel,
  FitnessGoal,
  GymGroup,
  LoadProgressionPoint,
  UserProfile,
} from "@/types/fitness";
import {
  calculateNutritionTargets,
  DEFAULT_USER_PROFILE,
  generateSeedAttendance,
  generateSuggestedMeals,
  generateWeeklyWorkoutPlan,
  SEED_BODY_WEIGHT_HISTORY,
  SEED_COMPETITORS,
  SEED_GYM_GROUPS,
  SEED_LOAD_HISTORY,
} from "@/data/seed";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export type ActiveTab =
  | "inicio"
  | "treino"
  | "alimentacao"
  | "calendario"
  | "ranking"
  | "perfil";

export interface CompletedWorkoutSummary {
  title: string;
  muscleFocus: string;
  durationMinutes: number;
  totalVolumeKg: number;
  setsCompleted: number;
  pointsEarned: number;
  newStreak: number;
  dateFormatted: string;
}

interface AppContextType {
  // Navegação e Modais
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedExerciseModal: ExerciseCatalogItem | null;
  setSelectedExerciseModal: (ex: ExerciseCatalogItem | null) => void;
  completedWorkoutModal: CompletedWorkoutSummary | null;
  setCompletedWorkoutModal: (summary: CompletedWorkoutSummary | null) => void;

  // Autenticação e Perfil
  isAuthenticated: boolean;
  loginWithEmail: (email: string, name?: string) => void;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  profile: UserProfile;
  updateProfile: (
    updates: Partial<UserProfile>,
    regeneratePlan?: boolean
  ) => void;

  // Treino Semanal e do Dia
  weeklyPlan: DailyWorkoutPlan[];
  selectedDayOfWeek: number;
  setSelectedDayOfWeek: (day: number) => void;
  currentDayPlan: DailyWorkoutPlan;
  toggleSetComplete: (
    dayOfWeek: number,
    exerciseIdx: number,
    setIdx: number
  ) => void;
  updateSetData: (
    dayOfWeek: number,
    exerciseIdx: number,
    setIdx: number,
    weightKg: number,
    reps: string
  ) => void;
  addExerciseToDay: (dayOfWeek: number, exercise: ExerciseCatalogItem) => void;
  removeExerciseFromDay: (dayOfWeek: number, exerciseIdx: number) => void;
  regeneratePlanForGoalAndLevel: (
    goal: FitnessGoal,
    level: ExperienceLevel
  ) => void;
  applyInstructorPreset: (presetName: string) => void;
  finishWorkoutOfTheDay: (dayOfWeek: number, durationMinutes?: number) => void;

  // Cronômetro de Descanso entre Séries
  restTimerSeconds: number;
  restTimerTarget: number;
  restTimerActive: boolean;
  startRestTimer: (seconds: number) => void;
  addRestTimerSeconds: (delta: number) => void;
  stopRestTimer: () => void;

  // Alimentação e Hidratação
  nutrition: DailyNutritionState;
  nutritionTargets: {
    calories: number;
    proteinG: number;
    carbsG: number;
    fatG: number;
    waterTargetMl: number;
  };
  nutritionConsumed: {
    calories: number;
    proteinG: number;
    carbsG: number;
    fatG: number;
  };
  toggleMealChecked: (mealId: string) => void;
  addWaterMl: (ml: number) => void;
  addCustomFood: (food: Omit<CustomFoodItem, "id" | "time">) => void;

  // Calendário de Frequência
  attendance: Record<string, AttendanceRecord>;
  markManualAttendance: (
    dateIso: string,
    status: AttendanceStatus,
    note?: string
  ) => void;

  // Ranking e Grupos
  competitors: CompetitorRank[];
  gymGroups: GymGroup[];
  joinOrCreateGymGroup: (code: string, groupName?: string) => void;

  // Evolução de Carga, Peso e Conquistas
  loadHistory: Record<string, LoadProgressionPoint[]>;
  bodyWeightHistory: BodyWeightEntry[];
  addBodyWeightEntry: (weightKg: number, waistCm?: number, armCm?: number) => void;
  achievements: AchievementBadge[];
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = "forja_pwa_state_v1";

export function getTodayIso(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(now.getDate()).padStart(2, "0")}`;
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const todayDayOfWeek = useMemo(() => {
    const d = new Date().getDay();
    // Se hoje for Domingo (descanso), mostra Segunda-feira como padrão editável ou o dia real
    return d;
  }, []);

  const [activeTab, setActiveTab] = useState<ActiveTab>("inicio");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [weeklyPlan, setWeeklyPlan] = useState<DailyWorkoutPlan[]>(() =>
    generateWeeklyWorkoutPlan(
      DEFAULT_USER_PROFILE.goal,
      DEFAULT_USER_PROFILE.level
    )
  );
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState<number>(
    todayDayOfWeek === 0 ? 1 : todayDayOfWeek
  );
  const [nutrition, setNutrition] = useState<DailyNutritionState>(() => ({
    date: getTodayIso(),
    waterMl: 1750,
    meals: generateSuggestedMeals(DEFAULT_USER_PROFILE),
    customFoods: [],
  }));
  const [attendance, setAttendance] = useState<
    Record<string, AttendanceRecord>
  >(() => generateSeedAttendance());
  const [gymGroups, setGymGroups] = useState<GymGroup[]>(SEED_GYM_GROUPS);
  const [loadHistory, setLoadHistory] =
    useState<Record<string, LoadProgressionPoint[]>>(SEED_LOAD_HISTORY);
  const [bodyWeightHistory, setBodyWeightHistory] = useState<BodyWeightEntry[]>(
    SEED_BODY_WEIGHT_HISTORY
  );

  // Modais e Toasts
  const [selectedExerciseModal, setSelectedExerciseModal] =
    useState<ExerciseCatalogItem | null>(null);
  const [completedWorkoutModal, setCompletedWorkoutModal] =
    useState<CompletedWorkoutSummary | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Cronômetro de Descanso
  const [restTimerSeconds, setRestTimerSeconds] = useState<number>(0);
  const [restTimerTarget, setRestTimerTarget] = useState<number>(60);
  const [restTimerActive, setRestTimerActive] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3400);
  };

  // Sincronização inicial com Supabase (Sessão + Grupos + Ranking Real)
  useEffect(() => {
    const sb = supabase;
    if (!isSupabaseConfigured || !sb) return;

    const syncFromSupabase = async () => {
      try {
        const {
          data: { session },
        } = await sb.auth.getSession();

        if (session?.user) {
          setIsAuthenticated(true);
          const { data: dbProfile } = await sb
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (dbProfile) {
            setProfile((prev) => ({
              ...prev,
              id: dbProfile.id,
              name: dbProfile.name || prev.name,
              email: dbProfile.email || session.user.email || prev.email,
              avatarUrl: dbProfile.avatar_url || prev.avatarUrl,
              age: dbProfile.age ?? prev.age,
              weightKg: Number(dbProfile.weight_kg ?? prev.weightKg),
              heightCm: dbProfile.height_cm ?? prev.heightCm,
              goal: dbProfile.goal || prev.goal,
              level: dbProfile.level || prev.level,
              points: dbProfile.points ?? prev.points,
              weeklyPoints: dbProfile.weekly_points ?? prev.weeklyPoints,
              currentStreak: dbProfile.current_streak ?? prev.currentStreak,
              bestStreak: dbProfile.best_streak ?? prev.bestStreak,
              gymCode: dbProfile.gym_code || prev.gymCode,
            }));
          }
        }

        // Busca grupos de academia do banco caso a tabela já tenha sido criada
        const { data: dbGroups } = await sb.from("gym_groups").select("*");
        if (dbGroups && dbGroups.length > 0) {
          setGymGroups((prev) => {
            const existingCodes = new Set(prev.map((g) => g.code));
            const merged = [...prev];
            dbGroups.forEach((g) => {
              if (!existingCodes.has(g.code)) {
                merged.push({
                  code: g.code,
                  name: g.name,
                  memberCount: 12,
                  description: g.description || "Grupo oficial Supabase",
                  weeklyChallengeTitle:
                    g.weekly_challenge_title ||
                    "Bater 4 treinos + 15L de água na semana",
                  weeklyChallengeReward: g.weekly_challenge_reward || 300,
                });
              }
            });
            return merged;
          });
        }
      } catch {
        // Mantém fallback local caso as tabelas ainda não tenham sido criadas no Supabase
      }
    };

    syncFromSupabase();
  }, []);

  // Carregar estado persistido no navegador
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.profile) setProfile(parsed.profile);
        if (parsed.weeklyPlan) setWeeklyPlan(parsed.weeklyPlan);
        if (parsed.nutrition) setNutrition(parsed.nutrition);
        if (parsed.attendance) setAttendance(parsed.attendance);
        if (parsed.gymGroups) setGymGroups(parsed.gymGroups);
        if (parsed.loadHistory) setLoadHistory(parsed.loadHistory);
        if (parsed.bodyWeightHistory)
          setBodyWeightHistory(parsed.bodyWeightHistory);
        if (typeof parsed.isAuthenticated === "boolean") {
          setIsAuthenticated(parsed.isAuthenticated);
        }
      }
    } catch {
      // Usa o seed padrão caso o storage esteja vazio
    }
  }, []);

  // Salvar alterações automaticamente no LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          isAuthenticated,
          profile,
          weeklyPlan,
          nutrition,
          attendance,
          gymGroups,
          loadHistory,
          bodyWeightHistory,
        })
      );
    } catch {
      // Ignora erro de quota
    }
  }, [
    isAuthenticated,
    profile,
    weeklyPlan,
    nutrition,
    attendance,
    gymGroups,
    loadHistory,
    bodyWeightHistory,
  ]);

  // Efeito do Cronômetro de Descanso
  useEffect(() => {
    if (!restTimerActive || restTimerSeconds <= 0) {
      if (restTimerActive && restTimerSeconds <= 0) {
        setRestTimerActive(false);
        showToast("⚡ Descanso finalizado! Hora da próxima série!");
      }
      return;
    }
    const timer = setInterval(() => {
      setRestTimerSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [restTimerActive, restTimerSeconds]);

  const startRestTimer = (seconds: number) => {
    setRestTimerTarget(seconds);
    setRestTimerSeconds(seconds);
    setRestTimerActive(true);
  };

  const addRestTimerSeconds = (delta: number) => {
    setRestTimerSeconds((prev) => Math.max(0, prev + delta));
    setRestTimerTarget((prev) => Math.max(15, prev + delta));
  };

  const stopRestTimer = () => {
    setRestTimerActive(false);
    setRestTimerSeconds(0);
  };

  // Autenticação
  const loginWithEmail = (email: string, name?: string) => {
    setProfile((prev) => ({
      ...prev,
      email: email || prev.email,
      name: name ? name : prev.name,
    }));
    setIsAuthenticated(true);
    showToast("Bem-vindo à FORJA! Bora construir o shape!");
  };

  const loginWithGoogle = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });
      return;
    }
    setIsAuthenticated(true);
    showToast("Autenticado com conta Google!");
  };

  const logout = () => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.signOut();
    }
    setIsAuthenticated(false);
    showToast("Sessão encerrada. Até o próximo treino!");
  };

  // Atualizar Perfil
  const updateProfile = (
    updates: Partial<UserProfile>,
    regeneratePlan = false
  ) => {
    setProfile((prev) => {
      const next = { ...prev, ...updates };
      if (regeneratePlan) {
        setWeeklyPlan(generateWeeklyWorkoutPlan(next.goal, next.level));
        setNutrition((nut) => ({
          ...nut,
          meals: generateSuggestedMeals(next),
        }));
      }
      return next;
    });
    showToast("Perfil atualizado com sucesso!");
  };

  const currentDayPlan = useMemo(() => {
    return (
      weeklyPlan.find((d) => d.dayOfWeek === selectedDayOfWeek) || weeklyPlan[1]
    );
  }, [weeklyPlan, selectedDayOfWeek]);

  // Marcar Série como Concluída e disparar Cronômetro
  const toggleSetComplete = (
    dayOfWeek: number,
    exerciseIdx: number,
    setIdx: number
  ) => {
    let shouldStartRest = false;
    let restSec = 60;
    let exerciseIdToLog = "";
    let weightUsed = 0;
    let repsUsed = 10;

    setWeeklyPlan((prev) =>
      prev.map((day) => {
        if (day.dayOfWeek !== dayOfWeek) return day;
        const exercises = day.exercises.map((ex, eIdx) => {
          if (eIdx !== exerciseIdx) return ex;
          const setLogs = ex.setLogs.map((s, sIdx) => {
            if (sIdx !== setIdx) return s;
            const nextCompleted = !s.completed;
            if (nextCompleted) {
              shouldStartRest = true;
              restSec = ex.restSeconds;
              exerciseIdToLog = ex.exerciseId;
              weightUsed = s.weightKg;
              repsUsed = parseInt(s.reps, 10) || 10;
            }
            return { ...s, completed: nextCompleted };
          });
          return { ...ex, setLogs };
        });
        return { ...day, exercises };
      })
    );

    if (shouldStartRest) {
      startRestTimer(restSec);
      if (exerciseIdToLog && weightUsed > 0) {
        setLoadHistory((prev) => {
          const list = prev[exerciseIdToLog] || [];
          const last = list[list.length - 1];
          if (last && last.date === "Hoje") {
            return {
              ...prev,
              [exerciseIdToLog]: [
                ...list.slice(0, -1),
                {
                  date: "Hoje",
                  weightKg: Math.max(last.weightKg, weightUsed),
                  reps: repsUsed,
                },
              ],
            };
          }
          return {
            ...prev,
            [exerciseIdToLog]: [
              ...list,
              { date: "Hoje", weightKg: weightUsed, reps: repsUsed },
            ],
          };
        });
      }
    }
  };

  const updateSetData = (
    dayOfWeek: number,
    exerciseIdx: number,
    setIdx: number,
    weightKg: number,
    reps: string
  ) => {
    setWeeklyPlan((prev) =>
      prev.map((day) => {
        if (day.dayOfWeek !== dayOfWeek) return day;
        const exercises = day.exercises.map((ex, eIdx) => {
          if (eIdx !== exerciseIdx) return ex;
          const setLogs = ex.setLogs.map((s, sIdx) =>
            sIdx === setIdx ? { ...s, weightKg, reps } : s
          );
          return { ...ex, targetWeightKg: weightKg, setLogs };
        });
        return { ...day, exercises };
      })
    );
  };

  const addExerciseToDay = (
    dayOfWeek: number,
    exercise: ExerciseCatalogItem
  ) => {
    setWeeklyPlan((prev) =>
      prev.map((day) => {
        if (day.dayOfWeek !== dayOfWeek) return day;
        return {
          ...day,
          isRestDay: false,
          exercises: [
            ...day.exercises,
            {
              exerciseId: exercise.id,
              sets: exercise.defaultSets,
              reps: exercise.defaultReps,
              restSeconds: exercise.defaultRestSeconds,
              targetWeightKg: exercise.defaultWeightKg,
              setLogs: Array.from({ length: exercise.defaultSets }, (_, i) => ({
                setNumber: i + 1,
                reps: exercise.defaultReps.split(" ")[0] || "10",
                weightKg: exercise.defaultWeightKg,
                completed: false,
              })),
            },
          ],
        };
      })
    );
    showToast(`"${exercise.name}" adicionado ao treino!`);
  };

  const removeExerciseFromDay = (dayOfWeek: number, exerciseIdx: number) => {
    setWeeklyPlan((prev) =>
      prev.map((day) => {
        if (day.dayOfWeek !== dayOfWeek) return day;
        return {
          ...day,
          exercises: day.exercises.filter((_, idx) => idx !== exerciseIdx),
        };
      })
    );
    showToast("Exercício removido da ficha.");
  };

  const regeneratePlanForGoalAndLevel = (
    goal: FitnessGoal,
    level: ExperienceLevel
  ) => {
    const newPlans = generateWeeklyWorkoutPlan(goal, level);
    setWeeklyPlan(newPlans);
    setProfile((prev) => {
      const updated = { ...prev, goal, level };
      setNutrition((nut) => ({
        ...nut,
        meals: generateSuggestedMeals(updated),
      }));
      return updated;
    });
    showToast("Ficha semanal e dieta recalculadas para o seu objetivo!");
  };

  const applyInstructorPreset = (presetName: string) => {
    if (presetName === "push_pull_legs") {
      regeneratePlanForGoalAndLevel("ganhar_massa", "avancado");
      showToast("Ficha Personal (Push/Pull/Legs Pro) atribuída ao aluno!");
    } else if (presetName === "hiit_definicao") {
      regeneratePlanForGoalAndLevel("emagrecer", "intermediario");
      showToast("Ficha Personal (Definição Metabólica) atribuída ao aluno!");
    } else {
      regeneratePlanForGoalAndLevel("manter_shape", "iniciante");
      showToast("Ficha Personal (Adaptação Full Body) atribuída ao aluno!");
    }
  };

  // Finalizar Treino do Dia -> Pontos para o Ranking + Check-in no Calendário + Streak
  const finishWorkoutOfTheDay = (dayOfWeek: number, durationMinutes = 52) => {
    const dayPlan = weeklyPlan.find((d) => d.dayOfWeek === dayOfWeek);
    if (!dayPlan) return;

    let totalVolume = 0;
    let completedSetsCount = 0;

    dayPlan.exercises.forEach((ex) => {
      ex.setLogs.forEach((s) => {
        const repsNum = parseInt(s.reps, 10) || 10;
        if (s.completed) {
          completedSetsCount += 1;
          totalVolume += (s.weightKg || 15) * repsNum;
        } else {
          // Se o aluno clicou em finalizar direto, considera todas as séries feitas
          completedSetsCount += 1;
          totalVolume += (s.weightKg || 15) * repsNum;
        }
      });
    });

    // Marca todas as séries do dia como concluídas visualmente
    setWeeklyPlan((prev) =>
      prev.map((d) => {
        if (d.dayOfWeek !== dayOfWeek) return d;
        return {
          ...d,
          completedToday: true,
          exercises: d.exercises.map((ex) => ({
            ...ex,
            setLogs: ex.setLogs.map((s) => ({ ...s, completed: true })),
          })),
        };
      })
    );

    const todayIso = getTodayIso();
    const alreadyTrainedToday = attendance[todayIso]?.status === "trained";
    const pointsEarned = alreadyTrainedToday ? 50 : 180; // 150 treino + 30 bônus de streak

    const nextStreak = alreadyTrainedToday
      ? profile.currentStreak
      : profile.currentStreak + 1;

    setProfile((prev) => ({
      ...prev,
      points: prev.points + pointsEarned,
      weeklyPoints: prev.weeklyPoints + pointsEarned,
      currentStreak: nextStreak,
      bestStreak: Math.max(prev.bestStreak, nextStreak),
    }));

    setAttendance((prev) => ({
      ...prev,
      [todayIso]: {
        date: todayIso,
        status: "trained",
        source: "auto",
        workoutTitle: dayPlan.title,
        pointsAwarded: pointsEarned,
        volumeKg: totalVolume,
      },
    }));

    stopRestTimer();

    setCompletedWorkoutModal({
      title: dayPlan.title,
      muscleFocus: dayPlan.muscleFocus,
      durationMinutes,
      totalVolumeKg: totalVolume,
      setsCompleted: completedSetsCount,
      pointsEarned,
      newStreak: nextStreak,
      dateFormatted: new Date().toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    });
  };

  // Nutrição e Hidratação
  const nutritionTargets = useMemo(
    () => calculateNutritionTargets(profile),
    [profile]
  );

  const nutritionConsumed = useMemo(() => {
    const fromMeals = nutrition.meals
      .filter((m) => m.checked)
      .reduce(
        (acc, m) => ({
          calories: acc.calories + m.calories,
          proteinG: acc.proteinG + m.proteinG,
          carbsG: acc.carbsG + m.carbsG,
          fatG: acc.fatG + m.fatG,
        }),
        { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 }
      );

    return nutrition.customFoods.reduce(
      (acc, f) => ({
        calories: acc.calories + f.calories,
        proteinG: acc.proteinG + f.proteinG,
        carbsG: acc.carbsG + f.carbsG,
        fatG: acc.fatG + f.fatG,
      }),
      fromMeals
    );
  }, [nutrition]);

  const toggleMealChecked = (mealId: string) => {
    let earnedBonus = false;
    setNutrition((prev) => {
      const meals = prev.meals.map((m) => {
        if (m.id !== mealId) return m;
        if (!m.checked) earnedBonus = true;
        return { ...m, checked: !m.checked };
      });
      return { ...prev, meals };
    });

    if (earnedBonus) {
      setProfile((prev) => ({
        ...prev,
        points: prev.points + 15,
        weeklyPoints: prev.weeklyPoints + 15,
      }));
      showToast("🥗 Refeição registrada! +15 pts no Ranking!");
    }
  };

  const addWaterMl = (ml: number) => {
    setNutrition((prev) => {
      const nextWater = Math.max(0, prev.waterMl + ml);
      if (
        prev.waterMl < nutritionTargets.waterTargetMl &&
        nextWater >= nutritionTargets.waterTargetMl
      ) {
        setProfile((p) => ({
          ...p,
          points: p.points + 30,
          weeklyPoints: p.weeklyPoints + 30,
        }));
        showToast("💧 Meta de água batida! +30 pts no Ranking!");
      }
      return { ...prev, waterMl: nextWater };
    });
  };

  const addCustomFood = (food: Omit<CustomFoodItem, "id" | "time">) => {
    const nowTime = new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setNutrition((prev) => ({
      ...prev,
      customFoods: [
        ...prev.customFoods,
        { ...food, id: `food-${Date.now()}`, time: nowTime },
      ],
    }));
    showToast(`"${food.name}" adicionado ao diário alimentar!`);
  };

  // Calendário de Frequência Manual
  const markManualAttendance = (
    dateIso: string,
    status: AttendanceStatus,
    note?: string
  ) => {
    const wasTrained = attendance[dateIso]?.status === "trained";
    setAttendance((prev) => ({
      ...prev,
      [dateIso]: {
        date: dateIso,
        status,
        source: "manual",
        workoutTitle:
          note ||
          (status === "trained"
            ? "Check-in Manual na Academia"
            : status === "rest"
            ? "Dia de Descanso Planejado"
            : "Ausência Registrada"),
        pointsAwarded: status === "trained" ? 150 : 0,
      },
    }));

    if (status === "trained" && !wasTrained) {
      setProfile((prev) => ({
        ...prev,
        points: prev.points + 150,
        weeklyPoints: prev.weeklyPoints + 150,
        currentStreak: prev.currentStreak + 1,
        bestStreak: Math.max(prev.bestStreak, prev.currentStreak + 1),
      }));
      showToast("✅ Presença confirmada! +150 pts para o Ranking!");
    } else {
      showToast("Calendário de frequência atualizado.");
    }
  };

  // Ranking com usuário integrado e ordenado dinamicamente
  const competitors = useMemo(() => {
    const userAsCompetitor: CompetitorRank = {
      id: profile.id,
      name: profile.name,
      avatarUrl: profile.avatarUrl,
      points: profile.points,
      weeklyPoints: profile.weeklyPoints,
      streak: profile.currentStreak,
      workoutsCount: Object.values(attendance).filter(
        (a) => a.status === "trained"
      ).length,
      gymCode: profile.gymCode,
      badge: "🔥 Você",
      isCurrentUser: true,
    };
    return [...SEED_COMPETITORS, userAsCompetitor];
  }, [profile, attendance]);

  const joinOrCreateGymGroup = (code: string, groupName?: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) return;

    const exists = gymGroups.find((g) => g.code === cleanCode);
    if (!exists) {
      setGymGroups((prev) => [
        ...prev,
        {
          code: cleanCode,
          name: groupName?.trim() || `Pelotão ${cleanCode}`,
          memberCount: 1,
          description: "Grupo personalizado criado por convite.",
          weeklyChallengeTitle: "Bater 4 treinos na semana + Meta de Água",
          weeklyChallengeReward: 300,
        },
      ]);
    }
    setProfile((prev) => ({ ...prev, gymCode: cleanCode }));
    showToast(`Você entrou no grupo ${cleanCode}!`);
  };

  const addBodyWeightEntry = (
    weightKg: number,
    waistCm?: number,
    armCm?: number
  ) => {
    const label = new Date().toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    });
    setBodyWeightHistory((prev) => [
      ...prev,
      { date: label, weightKg, waistCm, armCm },
    ]);
    setProfile((prev) => ({ ...prev, weightKg }));
    showToast("Novas medidas corporais registradas!");
  };

  // Conquistas e Medalhas Dinâmicas
  const achievements: AchievementBadge[] = useMemo(() => {
    const trainedCount = Object.values(attendance).filter(
      (a) => a.status === "trained"
    ).length;
    const waterDone = nutrition.waterMl >= nutritionTargets.waterTargetMl;

    return [
      {
        id: "streak-7",
        title: "Chama Imortal (7 Dias)",
        description: "Mantenha uma sequência de 7 dias seguidos sem faltar.",
        icon: "🔥",
        unlocked: profile.currentStreak >= 7 || profile.bestStreak >= 7,
        progressText: `${Math.min(7, profile.currentStreak)}/7 dias atuais`,
        pointsReward: 200,
      },
      {
        id: "workouts-15",
        title: "Ratazana de Academia",
        description: "Conclua 15 treinos registrados no calendário do mês.",
        icon: "🏋️",
        unlocked: trainedCount >= 15,
        progressText: `${trainedCount}/15 treinos no mês`,
        pointsReward: 300,
      },
      {
        id: "hydration-master",
        title: "Hidratação Blindada",
        description: "Bata 100% da sua meta diária de água.",
        icon: "💧",
        unlocked: waterDone,
        progressText: `${nutrition.waterMl}/${nutritionTargets.waterTargetMl} ml`,
        pointsReward: 100,
      },
      {
        id: "elite-points",
        title: "Clube dos 2.500 Pontos",
        description: "Ultrapasse 2.500 pontos gerais no Ranking da academia.",
        icon: "👑",
        unlocked: profile.points >= 2500,
        progressText: `${profile.points}/2500 pts`,
        pointsReward: 500,
      },
    ];
  }, [attendance, nutrition.waterMl, nutritionTargets.waterTargetMl, profile]);

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedExerciseModal,
        setSelectedExerciseModal,
        completedWorkoutModal,
        setCompletedWorkoutModal,
        isAuthenticated,
        loginWithEmail,
        loginWithGoogle,
        logout,
        profile,
        updateProfile,
        weeklyPlan,
        selectedDayOfWeek,
        setSelectedDayOfWeek,
        currentDayPlan,
        toggleSetComplete,
        updateSetData,
        addExerciseToDay,
        removeExerciseFromDay,
        regeneratePlanForGoalAndLevel,
        applyInstructorPreset,
        finishWorkoutOfTheDay,
        restTimerSeconds,
        restTimerTarget,
        restTimerActive,
        startRestTimer,
        addRestTimerSeconds,
        stopRestTimer,
        nutrition,
        nutritionTargets,
        nutritionConsumed,
        toggleMealChecked,
        addWaterMl,
        addCustomFood,
        attendance,
        markManualAttendance,
        competitors,
        gymGroups,
        joinOrCreateGymGroup,
        loadHistory,
        bodyWeightHistory,
        addBodyWeightEntry,
        achievements,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useApp deve ser utilizado dentro de um AppProvider");
  }
  return ctx;
}
