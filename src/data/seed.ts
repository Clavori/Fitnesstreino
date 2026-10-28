import {
  AttendanceRecord,
  BodyWeightEntry,
  CompetitorRank,
  DailyWorkoutPlan,
  ExperienceLevel,
  FitnessGoal,
  GymGroup,
  LoadProgressionPoint,
  MealOption,
  UserProfile,
  WorkoutPlanExercise,
} from "@/types/fitness";
import { getExerciseById } from "./exercises";

export const DEFAULT_USER_PROFILE: UserProfile = {
  id: "user-demo-01",
  name: "Lucas Andrade",
  email: "lucas.andrade@forja.app",
  avatarUrl:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80",
  age: 27,
  weightKg: 78.5,
  heightCm: 178,
  goal: "ganhar_massa",
  level: "intermediario",
  points: 2480,
  weeklyPoints: 620,
  currentStreak: 6,
  bestStreak: 19,
  gymCode: "FORJA-HQ",
  role: "aluno",
};

function makeWorkoutExercise(
  exerciseId: string,
  level: ExperienceLevel,
  goal: FitnessGoal
): WorkoutPlanExercise {
  const catalog = getExerciseById(exerciseId);
  const levelMultiplier =
    level === "iniciante" ? 0.7 : level === "avancado" ? 1.25 : 1.0;
  const sets =
    level === "iniciante"
      ? Math.max(3, catalog.defaultSets - 1)
      : level === "avancado"
      ? catalog.defaultSets + 1
      : catalog.defaultSets;
  const reps =
    goal === "emagrecer"
      ? "12 a 15"
      : goal === "ganhar_massa"
      ? catalog.defaultReps
      : "10 a 12";
  const restSeconds =
    goal === "emagrecer"
      ? Math.max(45, catalog.defaultRestSeconds - 15)
      : catalog.defaultRestSeconds;
  const targetWeightKg = Math.round(catalog.defaultWeightKg * levelMultiplier);

  return {
    exerciseId,
    sets,
    reps,
    restSeconds,
    targetWeightKg,
    setLogs: Array.from({ length: sets }, (_, idx) => ({
      setNumber: idx + 1,
      reps: reps.split(" ")[0] || "10",
      weightKg: targetWeightKg,
      completed: false,
    })),
  };
}

/**
 * Gera a programação semanal completa (Segunda a Domingo) personalizada
 * conforme o Objetivo e o Nível do aluno.
 */
export function generateWeeklyWorkoutPlan(
  goal: FitnessGoal,
  level: ExperienceLevel
): DailyWorkoutPlan[] {
  const goalLabel =
    goal === "emagrecer"
      ? "Definição & Queima"
      : goal === "ganhar_massa"
      ? "Hipertrofia Máxima"
      : "Força & Manutenção";

  return [
    {
      dayOfWeek: 0,
      dayName: "Domingo",
      shortDay: "DOM",
      title: "Recuperação Ativa & Mobilidade",
      muscleFocus: "Descanso Regenerativo",
      estimatedMinutes: 0,
      isRestDay: true,
      exercises: [],
    },
    {
      dayOfWeek: 1,
      dayName: "Segunda-feira",
      shortDay: "SEG",
      title: `Treino A — Peito, Ombro Frontal e Tríceps (${goalLabel})`,
      muscleFocus: "Peito e Tríceps",
      estimatedMinutes: 55,
      isRestDay: false,
      exercises: [
        makeWorkoutExercise("supino-reto-barra", level, goal),
        makeWorkoutExercise("supino-inclinado-halteres", level, goal),
        makeWorkoutExercise("crucifixo-maquina-peck-deck", level, goal),
        makeWorkoutExercise("desenvolvimento-halteres", level, goal),
        makeWorkoutExercise("triceps-pulley-corda", level, goal),
        makeWorkoutExercise("triceps-frances-polia-halter", level, goal),
      ],
    },
    {
      dayOfWeek: 2,
      dayName: "Terça-feira",
      shortDay: "TER",
      title: `Treino B — Costas Completas, Trapézio e Bíceps`,
      muscleFocus: "Costas e Bíceps",
      estimatedMinutes: 55,
      isRestDay: false,
      exercises: [
        makeWorkoutExercise("puxada-alta-frente", level, goal),
        makeWorkoutExercise("remada-curvada-barra", level, goal),
        makeWorkoutExercise("remada-baixa-triangulo", level, goal),
        makeWorkoutExercise("crucifixo-inverso-maquina", level, goal),
        makeWorkoutExercise("rosca-direta-barra-w", level, goal),
        makeWorkoutExercise("rosca-martelo-halteres", level, goal),
      ],
    },
    {
      dayOfWeek: 3,
      dayName: "Quarta-feira",
      shortDay: "QUA",
      title: `Treino C — Pernas Completo (Foco Quadríceps & Panturrilha)`,
      muscleFocus: "Pernas e Abdômen",
      estimatedMinutes: 60,
      isRestDay: false,
      exercises: [
        makeWorkoutExercise("agachamento-livre-barra", level, goal),
        makeWorkoutExercise("leg-press-45", level, goal),
        makeWorkoutExercise("cadeira-extensora", level, goal),
        makeWorkoutExercise("mesa-flexora", level, goal),
        makeWorkoutExercise("panturrilha-em-pe-maquina", level, goal),
        makeWorkoutExercise("prancha-isometrica", level, goal),
      ],
    },
    {
      dayOfWeek: 4,
      dayName: "Quinta-feira",
      shortDay: "QUI",
      title: `Treino D — Ombros 3D, Peitoral Superior e Core`,
      muscleFocus: "Ombros, Peito e Core",
      estimatedMinutes: 50,
      isRestDay: false,
      exercises: [
        makeWorkoutExercise("desenvolvimento-halteres", level, goal),
        makeWorkoutExercise("elevacao-lateral-halteres", level, goal),
        makeWorkoutExercise("face-pull-polia-corda", level, goal),
        makeWorkoutExercise("crossover-polia-alta", level, goal),
        makeWorkoutExercise("encolhimento-ombros-halteres", level, goal),
        makeWorkoutExercise("abdominal-supra-corda-polia", level, goal),
      ],
    },
    {
      dayOfWeek: 5,
      dayName: "Sexta-feira",
      shortDay: "SEX",
      title: `Treino E — Posterior de Coxa, Glúteos e Braços`,
      muscleFocus: "Posterior, Glúteos e Braços",
      estimatedMinutes: 60,
      isRestDay: false,
      exercises: [
        makeWorkoutExercise("stiff-barra-halteres", level, goal),
        makeWorkoutExercise("elevacao-pelvica-barra", level, goal),
        makeWorkoutExercise("afundo-bulgaro-halteres", level, goal),
        makeWorkoutExercise("rosca-scott-maquina-barra", level, goal),
        makeWorkoutExercise("triceps-testa-barra-w", level, goal),
      ],
    },
    {
      dayOfWeek: 6,
      dayName: "Sábado",
      shortDay: "SÁB",
      title: `Treino F — Full Body Metabólico & Core Blindado`,
      muscleFocus: "Corpo Inteiro & Abdômen",
      estimatedMinutes: 45,
      isRestDay: false,
      exercises: [
        makeWorkoutExercise("agachamento-hack-machine", level, goal),
        makeWorkoutExercise("puxada-triangulo", level, goal),
        makeWorkoutExercise("flexao-de-bracos", level, goal),
        makeWorkoutExercise("abdominal-infra-elevacao-pernas", level, goal),
        makeWorkoutExercise("abdominal-roda-ab-wheel", level, goal),
      ],
    },
  ];
}

/**
 * Calcula metas nutricionais diárias conforme Peso, Altura, Idade e Objetivo.
 */
export function calculateNutritionTargets(profile: UserProfile) {
  // Fórmula de Mifflin-St Jeor aproximada com fator de atividade moderado/intenso (1.55)
  const bmr = 10 * profile.weightKg + 6.25 * profile.heightCm - 5 * profile.age + 5;
  const tdee = Math.round(bmr * 1.55);

  let targetCalories = tdee;
  if (profile.goal === "emagrecer") targetCalories = Math.max(1500, tdee - 450);
  if (profile.goal === "ganhar_massa") targetCalories = tdee + 350;

  const proteinG = Math.round(
    profile.weightKg * (profile.goal === "emagrecer" ? 2.2 : 2.0)
  );
  const fatG = Math.round(profile.weightKg * 0.9);
  const remainingCalories = Math.max(
    400,
    targetCalories - proteinG * 4 - fatG * 9
  );
  const carbsG = Math.round(remainingCalories / 4);
  const waterTargetMl = Math.round((profile.weightKg * 38) / 100) * 100;

  return {
    calories: targetCalories,
    proteinG,
    carbsG,
    fatG,
    waterTargetMl,
  };
}

/**
 * Gera plano alimentar de 5 refeições adaptado ao objetivo do aluno.
 */
export function generateSuggestedMeals(profile: UserProfile): MealOption[] {
  const targets = calculateNutritionTargets(profile);
  const scale = targets.calories / 2500;

  if (profile.goal === "emagrecer") {
    return [
      {
        id: "cafe",
        time: "07:30",
        title: "Café da Manhã Proteico (Saciedade)",
        description: "Baixo índice glicêmico e alto teor de proteínas",
        items: [
          "3 ovos mexidos + 2 claras com espinafre",
          "1 fatia de pão integral 100% ou 40g de aveia",
          "1 porção de mamão ou morangos (120g)",
          "Café preto sem açúcar",
        ],
        calories: Math.round(410 * scale),
        proteinG: Math.round(32 * scale),
        carbsG: Math.round(35 * scale),
        fatG: Math.round(14 * scale),
        checked: true,
      },
      {
        id: "almoco",
        time: "12:30",
        title: "Almoço Limpo & Fibras",
        description: "Volume alto de vegetais com proteína magra",
        items: [
          "160g de peito de frango grelhado ou tilápia",
          "120g de arroz integral ou batata-doce",
          "80g de feijão carioca/preto",
          "Salada verde à vontade + brócolis no vapor + 1 col. chá de azeite",
        ],
        calories: Math.round(580 * scale),
        proteinG: Math.round(52 * scale),
        carbsG: Math.round(58 * scale),
        fatG: Math.round(12 * scale),
        checked: true,
      },
      {
        id: "lanche",
        time: "16:30",
        title: "Lanche Pré-Treino Energético",
        description: "Energia limpa para manter performance no treino",
        items: [
          "170g de iogurte natural desnatado",
          "1 scoop (30g) de Whey Protein",
          "1 banana prata amassada com canela",
        ],
        calories: Math.round(340 * scale),
        proteinG: Math.round(33 * scale),
        carbsG: Math.round(40 * scale),
        fatG: Math.round(4 * scale),
        checked: false,
      },
      {
        id: "jantar",
        time: "20:00",
        title: "Jantar Recuperador Pós-Treino",
        description: "Reposição muscular sem pesar na digestão",
        items: [
          "150g de patinho moído refogado ou peixe branco",
          "130g de purê de abóbora cabotiá ou mandioca",
          "Legumes grelhados (abobrinha, cenoura e tomate)",
        ],
        calories: Math.round(510 * scale),
        proteinG: Math.round(46 * scale),
        carbsG: Math.round(42 * scale),
        fatG: Math.round(15 * scale),
        checked: false,
      },
      {
        id: "ceia",
        time: "22:30",
        title: "Ceia Anti-Catabólica Leve",
        description: "Proteína de absorção gradual para o sono",
        items: [
          "2 ovos cozidos ou 120g de queijo cottage",
          "15g de castanhas-do-pará / amêndoas",
          "Chá de camomila ou melissa",
        ],
        calories: Math.round(230 * scale),
        proteinG: Math.round(18 * scale),
        carbsG: Math.round(6 * scale),
        fatG: Math.round(15 * scale),
        checked: false,
      },
    ];
  }

  return [
    {
      id: "cafe",
      time: "07:30",
      title: "Café da Manhã Anabólico",
      description: "Combustível completo para síntese proteica logo cedo",
      items: [
        "3 ovos inteiros mexidos com 30g de queijo minas",
        "2 fatias de pão integral ou tapioca com chia",
        "1 banana + 30g de aveia em flocos",
        "Café preto ou com leite desnatado",
      ],
      calories: Math.round(560 * scale),
      proteinG: Math.round(36 * scale),
      carbsG: Math.round(58 * scale),
      fatG: Math.round(19 * scale),
      checked: true,
    },
    {
      id: "almoco",
      time: "12:30",
      title: "Almoço Construtor (Prato de Atleta)",
      description: "Base sólida de carboidratos complexos e aminoácidos",
      items: [
        "180g de filé de frango grelhado ou alcatra magra",
        "200g de arroz branco/integral + 100g de feijão",
        "Salada colorida + 1 colher de sopa de azeite extra virgem",
      ],
      calories: Math.round(760 * scale),
      proteinG: Math.round(58 * scale),
      carbsG: Math.round(86 * scale),
      fatG: Math.round(18 * scale),
      checked: true,
    },
    {
      id: "lanche",
      time: "16:30",
      title: "Pré-Treino de Alta Performance",
      description: "Glicogênio muscular máximo para erguer mais carga",
      items: [
        "1 scoop de Whey Protein (30g) + 40g de aveia",
        "1 banana nanica + 15g de pasta de amendoim integral",
      ],
      calories: Math.round(470 * scale),
      proteinG: Math.round(34 * scale),
      carbsG: Math.round(54 * scale),
      fatG: Math.round(12 * scale),
      checked: false,
    },
    {
      id: "jantar",
      time: "20:30",
      title: "Jantar Pós-Treino (Janela Recuperadora)",
      description: "Recarga de glicogênio e reparação de microlesões",
      items: [
        "170g de patinho moído ou peito de frango desfiado",
        "200g de batata-inglesa assada, macarrão ou arroz",
        "Brócolis e cenoura no vapor",
      ],
      calories: Math.round(640 * scale),
      proteinG: Math.round(52 * scale),
      carbsG: Math.round(72 * scale),
      fatG: Math.round(14 * scale),
      checked: false,
    },
    {
      id: "ceia",
      time: "22:45",
      title: "Ceia Noturna (Liberação Lenta)",
      description: "Mantém balanço nitrogenado positivo durante o sono",
      items: [
        "170g de iogurte grego natural zero + 15g de whey ou albumina",
        "20g de mix de castanhas ou pasta de amendoim",
      ],
      calories: Math.round(310 * scale),
      proteinG: Math.round(26 * scale),
      carbsG: Math.round(14 * scale),
      fatG: Math.round(16 * scale),
      checked: false,
    },
  ];
}

/**
 * Gera histórico realista do mês atual para o Calendário de Frequência.
 */
export function generateSeedAttendance(): Record<string, AttendanceRecord> {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const todayDate = now.getDate();
  const records: Record<string, AttendanceRecord> = {};

  const titles = [
    "Descanso Regenerativo",
    "Treino A — Peito e Tríceps",
    "Treino B — Costas e Bíceps",
    "Treino C — Pernas Completo",
    "Treino D — Ombros 3D e Core",
    "Treino E — Posterior e Braços",
    "Treino F — Full Body",
  ];

  for (let d = 1; d < todayDate; d++) {
    const dateObj = new Date(year, month, d);
    const dayOfWeek = dateObj.getDay();
    const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      d
    ).padStart(2, "0")}`;

    // Últimos 6 dias seguidos treinados (ou descanso planejado no domingo) para sustentar a streak de 6 dias
    const daysAgo = todayDate - d;

    if (dayOfWeek === 0) {
      records[iso] = {
        date: iso,
        status: "rest",
        source: "auto",
        workoutTitle: "Domingo de Recuperação",
        pointsAwarded: 0,
      };
    } else if (daysAgo <= 6) {
      records[iso] = {
        date: iso,
        status: "trained",
        source: "auto",
        workoutTitle: titles[dayOfWeek],
        pointsAwarded: 150,
        volumeKg: 8400 + d * 120,
      };
    } else if (d % 6 === 0) {
      records[iso] = {
        date: iso,
        status: "missed",
        source: "auto",
        workoutTitle: "Falta registrada",
        pointsAwarded: 0,
      };
    } else {
      records[iso] = {
        date: iso,
        status: "trained",
        source: "auto",
        workoutTitle: titles[dayOfWeek],
        pointsAwarded: 150,
        volumeKg: 7900 + d * 110,
      };
    }
  }

  return records;
}

export const SEED_GYM_GROUPS: GymGroup[] = [
  {
    code: "FORJA-HQ",
    name: "Academia Forja Iron Club",
    memberCount: 148,
    description: "Ranking oficial da unidade matriz — todos os alunos ativos.",
    weeklyChallengeTitle: "Desafio da Semana: 4 Treinos + 15L de Água",
    weeklyChallengeReward: 300,
  },
  {
    code: "MONSTROS-26",
    name: "Esquadrão 6h da Manhã",
    memberCount: 14,
    description: "Turma das 06:00 que não falha nem na chuva.",
    weeklyChallengeTitle: "Zero faltas de Segunda a Sexta + Bater Proteína",
    weeklyChallengeReward: 400,
  },
  {
    code: "PROJETO-VERAO",
    name: "Desafio Seca Tudo 90D",
    memberCount: 38,
    description: "Grupo focado em definição muscular e constância na dieta.",
    weeklyChallengeTitle: "5 Treinos Concluídos + Meta de Calorias 100%",
    weeklyChallengeReward: 350,
  },
];

export const SEED_COMPETITORS: CompetitorRank[] = [
  {
    id: "comp-1",
    name: "camila.fit",
    avatarUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=240&auto=format&fit=crop&q=80",
    points: 3420,
    weeklyPoints: 910,
    streak: 21,
    workoutsCount: 24,
    gymCode: "FORJA-HQ",
    badge: "👑 Lenda da Constância",
  },
  {
    id: "comp-2",
    name: "Rafael Costa",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&auto=format&fit=crop&q=80",
    points: 3190,
    weeklyPoints: 840,
    streak: 16,
    workoutsCount: 22,
    gymCode: "FORJA-HQ",
    badge: "🔥 Imparável",
  },
  {
    id: "comp-3",
    name: "Bianca Moreira",
    avatarUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=240&auto=format&fit=crop&q=80",
    points: 2950,
    weeklyPoints: 790,
    streak: 14,
    workoutsCount: 20,
    gymCode: "FORJA-HQ",
    badge: "⚡ Elite Forja",
  },
  {
    id: "comp-4",
    name: "Matheus Oliveira",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&auto=format&fit=crop&q=80",
    points: 2740,
    weeklyPoints: 710,
    streak: 11,
    workoutsCount: 19,
    gymCode: "MONSTROS-26",
    badge: "💪 Monstro da Carga",
  },
  {
    id: "comp-5",
    name: "Juliana Ribeiro",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=240&auto=format&fit=crop&q=80",
    points: 2610,
    weeklyPoints: 670,
    streak: 9,
    workoutsCount: 18,
    gymCode: "FORJA-HQ",
    badge: "🥗 Dieta Blindada",
  },
  {
    id: "comp-6",
    name: "Gabriel Santos",
    avatarUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=240&auto=format&fit=crop&q=80",
    points: 2540,
    weeklyPoints: 640,
    streak: 7,
    workoutsCount: 17,
    gymCode: "MONSTROS-26",
    badge: "🏋️ Veterano",
  },
  {
    id: "comp-7",
    name: "Fernanda Lima",
    avatarUrl:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=240&auto=format&fit=crop&q=80",
    points: 2390,
    weeklyPoints: 580,
    streak: 5,
    workoutsCount: 16,
    gymCode: "FORJA-HQ",
    badge: "💧 Hidratação 100%",
  },
  {
    id: "comp-8",
    name: "Bruno Martins",
    avatarUrl:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=240&auto=format&fit=crop&q=80",
    points: 2210,
    weeklyPoints: 520,
    streak: 5,
    workoutsCount: 15,
    gymCode: "PROJETO-VERAO",
    badge: "🎯 Focado",
  },
  {
    id: "comp-9",
    name: "Letícia Alves",
    avatarUrl:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=240&auto=format&fit=crop&q=80",
    points: 2050,
    weeklyPoints: 490,
    streak: 4,
    workoutsCount: 14,
    gymCode: "FORJA-HQ",
    badge: "⚡ Constante",
  },
  {
    id: "comp-10",
    name: "Diego Ferreira",
    avatarUrl:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=240&auto=format&fit=crop&q=80",
    points: 1890,
    weeklyPoints: 430,
    streak: 3,
    workoutsCount: 12,
    gymCode: "MONSTROS-26",
    badge: "🔥 Em Ascensão",
  },
  {
    id: "comp-11",
    name: "Amanda Rocha",
    avatarUrl:
      "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?w=240&auto=format&fit=crop&q=80",
    points: 1720,
    weeklyPoints: 390,
    streak: 3,
    workoutsCount: 11,
    gymCode: "PROJETO-VERAO",
    badge: "🌱 Disciplinada",
  },
];

export const SEED_LOAD_HISTORY: Record<string, LoadProgressionPoint[]> = {
  "supino-reto-barra": [
    { date: "Sem 1", weightKg: 50, reps: 10 },
    { date: "Sem 2", weightKg: 52, reps: 10 },
    { date: "Sem 3", weightKg: 56, reps: 9 },
    { date: "Sem 4", weightKg: 58, reps: 10 },
    { date: "Sem 5", weightKg: 60, reps: 10 },
  ],
  "agachamento-livre-barra": [
    { date: "Sem 1", weightKg: 56, reps: 10 },
    { date: "Sem 2", weightKg: 60, reps: 10 },
    { date: "Sem 3", weightKg: 64, reps: 8 },
    { date: "Sem 4", weightKg: 68, reps: 8 },
    { date: "Sem 5", weightKg: 70, reps: 10 },
  ],
  "puxada-alta-frente": [
    { date: "Sem 1", weightKg: 40, reps: 12 },
    { date: "Sem 2", weightKg: 45, reps: 10 },
    { date: "Sem 3", weightKg: 45, reps: 12 },
    { date: "Sem 4", weightKg: 50, reps: 10 },
    { date: "Sem 5", weightKg: 52, reps: 10 },
  ],
  "leg-press-45": [
    { date: "Sem 1", weightKg: 120, reps: 12 },
    { date: "Sem 2", weightKg: 140, reps: 12 },
    { date: "Sem 3", weightKg: 150, reps: 10 },
    { date: "Sem 4", weightKg: 160, reps: 10 },
    { date: "Sem 5", weightKg: 170, reps: 12 },
  ],
};

export const SEED_BODY_WEIGHT_HISTORY: BodyWeightEntry[] = [
  { date: "01/Set", weightKg: 75.8, waistCm: 83, armCm: 37.5 },
  { date: "15/Set", weightKg: 76.4, waistCm: 82.5, armCm: 38.0 },
  { date: "01/Out", weightKg: 77.2, waistCm: 82.0, armCm: 38.4 },
  { date: "15/Out", weightKg: 77.9, waistCm: 81.8, armCm: 38.8 },
  { date: "Hoje", weightKg: 78.5, waistCm: 81.5, armCm: 39.2 },
];
