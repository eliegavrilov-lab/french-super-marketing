export type ContentType = "expert" | "viral" | "personal";
export type Platform = "instagram" | "tiktok" | "youtube";
export type ContentStatus = "idea" | "planned" | "filmed" | "edited" | "published";

export interface ContentPiece {
  id: string;
  date: string;
  slot: number; // 1, 2, or 3
  type: ContentType;
  title: string;
  hook: string;
  script: string;
  cta: string;
  platforms: Platform[];
  status: ContentStatus;
  rubric: string;
  delfTie?: string; // how it ties to DELF B1/B2 promo
  sound?: string;
  notes?: string;
}

export interface DayPlan {
  date: string;
  pieces: ContentPiece[];
  warmupStage: string; // e.g. "awareness", "interest", "desire", "action"
}

export interface Inspiration {
  id: string;
  source: string;
  description: string;
  whyViral: string;
  adaptationIdea: string;
  rubric: string;
  createdAt: string;
}

export const RUBRICS = [
  { id: "memes", name: "Мемы / Произношение", type: "viral" as ContentType, description: "Мемы под популярные звуки, шутки над произношением с твоим лицом" },
  { id: "delf-hooks", name: "DELF Манипуляции", type: "expert" as ContentType, description: "\"Без этого не сдашь DELF\" — примеры и разборы, прогрев к курсам" },
  { id: "rap-rules", name: "Рэп-правила", type: "viral" as ContentType, description: "Правила французского под бит в стиле рэп (цифры, омонимы, дифтонги)" },
  { id: "lesson-moments", name: "Моменты с уроков", type: "personal" as ContentType, description: "Живые моменты с уроков, 20-25к просмотров стабильно" },
  { id: "behind-scenes", name: "Закулисье", type: "personal" as ContentType, description: "Процесс создания курсов, жизнь преподавателя" },
  { id: "student-results", name: "Результаты учеников", type: "expert" as ContentType, description: "Кейсы и истории успеха учеников" },
] as const;

export const WARMUP_STAGES = [
  { id: "awareness", name: "Осведомлённость", description: "Аудитория узнаёт о French Super", week: 1 },
  { id: "interest", name: "Интерес", description: "Аудитория интересуется DELF и методами", week: 2 },
  { id: "desire", name: "Желание", description: "Аудитория хочет подготовиться к DELF", week: 3 },
  { id: "action", name: "Действие", description: "Запуск курса, призыв к покупке", week: 4 },
] as const;
