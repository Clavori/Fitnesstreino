export type FitnessGoal = "emagrecer" | "ganhar_massa" | "manter_shape";
export type ExperienceLevel = "iniciante" | "intermediario" | "avancado";
export type MuscleGroup =
  | "Peito"
  | "Costas"
  | "Pernas"
  | "Ombros"
  | "Bíceps"
  | "Tríceps"
  | "Abdômen";

export type AnimationPattern =
  | "bench_press" // Supino / empurrar horizontal
  | "incline_press" // Supino inclinado
  | "chest_fly" // Crucifixo / Crossover / Peck deck
  | "pushup" // Flexão de braço / Mergulho
  | "lat_pulldown" // Puxada alta / Barra fixa
  | "seated_row" // Remada curvada / baixa / cavalinho
  | "deadlift" // Levantamento terra / Stiff / Bom dia
  | "squat" // Agachamento livre / Hack / Sumô / Búlgaro
  | "leg_press" // Leg press 45 / Extensora / Flexora
  | "calf_raise" // Panturrilha em pé / sentado
  | "hip_thrust" // Elevação pélvica / Glúteo
  | "shoulder_press" // Desenvolvimento ombro
  | "lateral_raise" // Elevação lateral / frontal / crucifixo inverso
  | "bicep_curl" // Rosca direta / alternada / martelo / scott
  | "tricep_pushdown" // Tríceps pulley / corda / testa / francês
  | "crunch" // Abdominal supra / infra / bicicleta
  | "plank"; // Prancha isométrica / Abdominal roda

export interface ExerciseCatalogItem {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  equipment: string;
  difficulty: ExperienceLevel;
  animationPattern: AnimationPattern;
  defaultSets: number;
  defaultReps: string;
  defaultRestSeconds: number;
  defaultWeightKg: number;
  postureTips: string[];
  commonMistakes: string[];
  executionSummary: string;
}

export interface WorkoutSetEntry {
  setNumber: number;
  reps: string;
  weightKg: number;
  completed: boolean;
}

export interface WorkoutPlanExercise {
  exerciseId: string;
  sets: number;
  reps: string;
  restSeconds: number;
  targetWeightKg: number;
  notes?: string;
  setLogs: WorkoutSetEntry[];
}

export interface DailyWorkoutPlan {
  dayOfWeek: number; // 0 = Dom, 1 = Seg, ..., 6 = Sáb
  dayName: string;
  shortDay: string;
  title: string;
  muscleFocus: string;
  estimatedMinutes: number;
  isRestDay: boolean;
  completedToday?: boolean;
  exercises: WorkoutPlanExercise[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  age: number;
  weightKg: number;
  heightCm: number;
  goal: FitnessGoal;
  level: ExperienceLevel;
  points: number;
  weeklyPoints: number;
  currentStreak: number;
  bestStreak: number;
  gymCode: string;
  role: "aluno" | "instrutor";
}

export interface MealOption {
  id: string;
  time: string;
  title: string;
  description: string;
  items: string[];
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  checked: boolean;
}

export interface CustomFoodItem {
  id: string;
  name: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  time: string;
}

export interface DailyNutritionState {
  date: string;
  waterMl: number;
  meals: MealOption[];
  customFoods: CustomFoodItem[];
}

export type AttendanceStatus = "trained" | "rest" | "missed";

export interface AttendanceRecord {
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  source: "auto" | "manual";
  workoutTitle?: string;
  pointsAwarded?: number;
  volumeKg?: number;
}

export interface CompetitorRank {
  id: string;
  name: string;
  avatarUrl: string;
  points: number;
  weeklyPoints: number;
  streak: number;
  workoutsCount: number;
  gymCode: string;
  badge: string;
  isCurrentUser?: boolean;
}

export interface GymGroup {
  code: string;
  name: string;
  memberCount: number;
  description: string;
  weeklyChallengeTitle: string;
  weeklyChallengeReward: number;
}

export interface LoadProgressionPoint {
  date: string;
  weightKg: number;
  reps: number;
}

export interface BodyWeightEntry {
  date: string;
  weightKg: number;
  waistCm?: number;
  armCm?: number;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progressText: string;
  pointsReward: number;
}
