"use client";

import { ContentPiece, ContentStatus } from "@/lib/types";
import { updatePieceStatus } from "@/lib/storage";
import { Instagram, Music, Youtube, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const STATUS_OPTIONS: { value: ContentStatus; label: string; color: string }[] = [
  { value: "idea", label: "Идея", color: "#a3a3a3" },
  { value: "planned", label: "Запланировано", color: "#6366f1" },
  { value: "filmed", label: "Снято", color: "#f59e0b" },
  { value: "edited", label: "Смонтировано", color: "#22c55e" },
  { value: "published", label: "Опубликовано", color: "#06b6d4" },
];

const TYPE_LABELS = {
  expert: "Эксперт",
  viral: "Виральность",
  personal: "Личность",
};

function PlatformIcon({ platform }: { platform: string }) {
  switch (platform) {
    case "instagram": return <Instagram size={14} className="platform-instagram" />;
    case "tiktok": return <Music size={14} className="platform-tiktok" />;
    case "youtube": return <Youtube size={14} className="platform-youtube" />;
    default: return null;
  }
}

export default function ContentCard({ piece, date, onStatusChange }: {
  piece: ContentPiece;
  date: string;
  onStatusChange?: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const handleStatusChange = (status: ContentStatus) => {
    updatePieceStatus(date, piece.id, status);
    onStatusChange?.();
  };

  return (
    <div className={`content-type-${piece.type} bg-[var(--card)] rounded-lg p-4 hover:bg-[var(--card-hover)] transition-colors`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`badge-${piece.type} text-xs px-2 py-0.5 rounded-full font-medium`}>
              {TYPE_LABELS[piece.type]}
            </span>
            <span className="text-xs text-[var(--text-muted)]">{piece.rubric}</span>
          </div>
          <h3 className="font-semibold text-sm mb-1 truncate">{piece.title}</h3>
          <p className="text-xs text-[var(--text-muted)] mb-2">🪝 {piece.hook}</p>
          <div className="flex items-center gap-2">
            {piece.platforms.map(p => (
              <PlatformIcon key={p} platform={p} />
            ))}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <select
            value={piece.status}
            onChange={(e) => handleStatusChange(e.target.value as ContentStatus)}
            className="text-xs bg-[var(--bg)] border border-[var(--border)] rounded px-2 py-1 text-[var(--text)]"
          >
            {STATUS_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-[var(--text-muted)] hover:text-[var(--text)]"
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-[var(--border)] space-y-2">
          <div>
            <p className="text-xs font-medium text-[var(--text-muted)] mb-1">Сценарий:</p>
            <p className="text-sm whitespace-pre-wrap">{piece.script}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-[var(--text-muted)] mb-1">CTA:</p>
            <p className="text-sm">{piece.cta}</p>
          </div>
          {piece.sound && (
            <div>
              <p className="text-xs font-medium text-[var(--text-muted)] mb-1">Звук:</p>
              <p className="text-sm">{piece.sound}</p>
            </div>
          )}
          {piece.delfTie && (
            <div>
              <p className="text-xs font-medium text-[var(--text-muted)] mb-1">Связь с DELF:</p>
              <p className="text-sm text-[var(--accent-light)]">{piece.delfTie}</p>
            </div>
          )}
          {piece.notes && (
            <div>
              <p className="text-xs font-medium text-[var(--text-muted)] mb-1">Заметки:</p>
              <p className="text-sm">{piece.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
