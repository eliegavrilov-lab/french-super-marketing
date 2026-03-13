"use client";

import { useState, useEffect, useCallback } from "react";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { ru } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Nav from "@/components/Nav";
import { DayPlan } from "@/lib/types";
import { getAllPlans } from "@/lib/storage";
import Link from "next/link";

const TYPE_COLORS = {
  expert: "bg-[var(--expert)]",
  viral: "bg-[var(--viral)]",
  personal: "bg-[var(--personal)]",
};

export default function CalendarPage() {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [plans, setPlans] = useState<DayPlan[]>([]);

  const loadPlans = useCallback(() => {
    setPlans(getAllPlans());
  }, []);

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const navigateWeek = (offset: number) => {
    setWeekStart(prev => addDays(prev, offset * 7));
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Nav />
      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Календарь контента</h2>
          <div className="flex items-center gap-2">
            <button onClick={() => navigateWeek(-1)} className="p-1 hover:bg-[var(--card)] rounded">
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm text-[var(--text-muted)]">
              {format(weekStart, "d MMM", { locale: ru })} — {format(addDays(weekStart, 6), "d MMM", { locale: ru })}
            </span>
            <button onClick={() => navigateWeek(1)} className="p-1 hover:bg-[var(--card)] rounded">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {days.map(day => {
            const dateStr = format(day, "yyyy-MM-dd");
            const plan = plans.find(p => p.date === dateStr);
            const isToday = isSameDay(day, new Date());

            return (
              <Link
                key={dateStr}
                href={`/?date=${dateStr}`}
                className={`bg-[var(--card)] rounded-lg p-3 min-h-[120px] hover:bg-[var(--card-hover)] transition-colors ${
                  isToday ? "ring-1 ring-[var(--accent)]" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${isToday ? "text-[var(--accent-light)]" : ""}`}>
                    {format(day, "EEE", { locale: ru })}
                  </span>
                  <span className="text-lg font-bold">{format(day, "d")}</span>
                </div>

                {plan ? (
                  <div className="space-y-1.5">
                    {plan.pieces.map(piece => (
                      <div
                        key={piece.id}
                        className={`content-type-${piece.type} rounded px-2 py-1`}
                      >
                        <p className="text-xs truncate">{piece.title}</p>
                        <div className="flex gap-1 mt-0.5">
                          {piece.platforms.map(p => (
                            <span
                              key={p}
                              className="w-1.5 h-1.5 rounded-full"
                              style={{
                                background: p === "instagram" ? "#e1306c" : p === "tiktok" ? "#00f2ea" : "#ff0000",
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[var(--text-muted)] mt-4 text-center">Нет плана</p>
                )}
              </Link>
            );
          })}
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Статистика недели</h3>
          <div className="grid grid-cols-3 gap-3">
            {(["viral", "expert", "personal"] as const).map(type => {
              const count = plans
                .filter(p => days.some(d => format(d, "yyyy-MM-dd") === p.date))
                .flatMap(p => p.pieces)
                .filter(p => p.type === type).length;

              return (
                <div key={type} className="bg-[var(--card)] rounded-lg p-4 text-center">
                  <div className={`w-3 h-3 rounded-full ${TYPE_COLORS[type]} mx-auto mb-2`} />
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {type === "viral" ? "Виральность" : type === "expert" ? "Эксперт" : "Личность"}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
