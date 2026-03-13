"use client";

import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Loader2, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import Nav from "@/components/Nav";
import ContentCard from "@/components/ContentCard";
import { DayPlan, ContentPiece, WARMUP_STAGES } from "@/lib/types";
import { getPlanForDate, saveDayPlan } from "@/lib/storage";

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

export default function Home() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [plan, setPlan] = useState<DayPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [warmupStage, setWarmupStage] = useState("awareness");

  const dateStr = format(currentDate, "yyyy-MM-dd");

  const loadPlan = useCallback(() => {
    const saved = getPlanForDate(dateStr);
    setPlan(saved);
  }, [dateStr]);

  useEffect(() => {
    loadPlan();
  }, [loadPlan]);

  const generatePlan = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: dateStr, warmupStage }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(`Ошибка: ${err.error}`);
        return;
      }

      const data = await res.json();
      const pieces: ContentPiece[] = data.pieces.map((p: Omit<ContentPiece, "id" | "date" | "status">, i: number) => ({
        ...p,
        id: generateId(),
        date: dateStr,
        status: "planned" as const,
        platforms: p.platforms || ["instagram", "tiktok", "youtube"],
        slot: i + 1,
      }));

      const dayPlan: DayPlan = {
        date: dateStr,
        pieces,
        warmupStage,
      };

      saveDayPlan(dayPlan);
      setPlan(dayPlan);
    } catch {
      alert("Ошибка генерации. Проверь API ключ в .env.local");
    } finally {
      setLoading(false);
    }
  };

  const navigateDay = (offset: number) => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + offset);
    setCurrentDate(d);
  };

  const stats = plan?.pieces.reduce(
    (acc, p) => {
      acc[p.type] = (acc[p.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Nav />
      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => navigateDay(-1)} className="p-1 hover:bg-[var(--card)] rounded">
              <ChevronLeft size={20} />
            </button>
            <div>
              <h2 className="text-xl font-bold">
                {format(currentDate, "d MMMM, EEEE", { locale: ru })}
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                {dateStr === format(new Date(), "yyyy-MM-dd") ? "Сегодня" : dateStr}
              </p>
            </div>
            <button onClick={() => navigateDay(1)} className="p-1 hover:bg-[var(--card)] rounded">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <select
            value={warmupStage}
            onChange={(e) => setWarmupStage(e.target.value)}
            className="text-sm bg-[var(--card)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text)]"
          >
            {WARMUP_STAGES.map(s => (
              <option key={s.id} value={s.id}>{s.name} — {s.description}</option>
            ))}
          </select>
          <button
            onClick={generatePlan}
            disabled={loading}
            className="flex items-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent-light)] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            {plan ? "Перегенерировать" : "Сгенерировать план"}
          </button>
        </div>

        {plan && stats && (
          <div className="flex gap-3 mb-6">
            {stats.viral && (
              <span className="badge-viral text-xs px-3 py-1 rounded-full">
                Виральность: {stats.viral}
              </span>
            )}
            {stats.expert && (
              <span className="badge-expert text-xs px-3 py-1 rounded-full">
                Эксперт: {stats.expert}
              </span>
            )}
            {stats.personal && (
              <span className="badge-personal text-xs px-3 py-1 rounded-full">
                Личность: {stats.personal}
              </span>
            )}
          </div>
        )}

        {plan ? (
          <div className="space-y-3">
            {plan.pieces
              .sort((a, b) => a.slot - b.slot)
              .map(piece => (
                <ContentCard
                  key={piece.id}
                  piece={piece}
                  date={dateStr}
                  onStatusChange={loadPlan}
                />
              ))}
          </div>
        ) : (
          <div className="text-center py-16 text-[var(--text-muted)]">
            <Sparkles size={40} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium mb-2">Нет плана на этот день</p>
            <p className="text-sm">Нажми &quot;Сгенерировать план&quot; чтобы AI составил контент-план</p>
          </div>
        )}
      </main>
    </div>
  );
}
