"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, Search, Trash2, Sparkles } from "lucide-react";
import Nav from "@/components/Nav";
import { Inspiration } from "@/lib/types";
import { getInspirations, saveInspirations, deleteInspiration } from "@/lib/storage";

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

export default function InspirationsPage() {
  const [items, setItems] = useState<Inspiration[]>([]);
  const [loading, setLoading] = useState(false);
  const [niche, setNiche] = useState("");

  const loadItems = useCallback(() => {
    setItems(getInspirations());
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const fetchInspirations = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/inspirations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(`Ошибка: ${err.error}`);
        return;
      }

      const data = await res.json();
      const newItems: Inspiration[] = data.inspirations.map((item: Omit<Inspiration, "id" | "createdAt">) => ({
        ...item,
        id: generateId(),
        createdAt: new Date().toISOString(),
      }));

      saveInspirations(newItems);
      loadItems();
    } catch {
      alert("Ошибка. Проверь API ключ.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    deleteInspiration(id);
    loadItems();
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Nav />
      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 max-w-3xl">
        <h2 className="text-xl font-bold mb-6">Вдохновение и тренды</h2>

        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="Уточни нишу (или оставь пустым для дефолта)..."
              className="w-full bg-[var(--card)] border border-[var(--border)] rounded-lg pl-9 pr-4 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)]"
            />
          </div>
          <button
            onClick={fetchInspirations}
            disabled={loading}
            className="flex items-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent-light)] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            Найти идеи
          </button>
        </div>

        {items.length > 0 ? (
          <div className="space-y-3">
            {items
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map(item => (
                <div key={item.id} className="bg-[var(--card)] rounded-lg p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs bg-[var(--accent)]/20 text-[var(--accent-light)] px-2 py-0.5 rounded-full">
                          {item.source}
                        </span>
                        <span className="text-xs text-[var(--text-muted)]">{item.rubric}</span>
                      </div>
                      <p className="text-sm font-medium mb-2">{item.description}</p>
                      <div className="space-y-1">
                        <p className="text-xs text-[var(--text-muted)]">
                          <span className="font-medium">Почему залетит:</span> {item.whyViral}
                        </p>
                        <p className="text-xs text-[var(--accent-light)]">
                          <span className="font-medium">Адаптация:</span> {item.adaptationIdea}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-[var(--text-muted)] hover:text-[var(--viral)] p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-16 text-[var(--text-muted)]">
            <Sparkles size={40} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium mb-2">Пока нет идей</p>
            <p className="text-sm">Нажми &quot;Найти идеи&quot; чтобы AI подобрал вирусные идеи для контента</p>
          </div>
        )}
      </main>
    </div>
  );
}
