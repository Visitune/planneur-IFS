'use client';

import { Activity } from '@/lib/types';
import { Clock, MapPin, FileText, GripVertical, Sun, SunDim } from 'lucide-react';

interface Props {
  activity: Activity;
  onToggleOnSite: (id: string) => void;
  onDurationChange: (id: string, duration: number) => void;
  isFirst?: boolean;
  isLast?: boolean;
  onMoveUp?: (id: string) => void;
  onMoveDown?: (id: string) => void;
  onMoveToDay?: (id: string, targetDay: number) => void;
  totalDays: number;
  currentDay: number;
}

export default function ActivityRow({
  activity, onToggleOnSite, onDurationChange,
  isFirst, isLast, onMoveUp, onMoveDown,
  onMoveToDay, totalDays, currentDay,
}: Props) {
  const isTraceability = activity.isTraceability;
  const isTerrain = activity.isOnSite && !activity.isFixed;
  const isFixed = activity.isFixed;

  let rowBg = 'transparent';
  let rowBorder = 'var(--accent-soft)';
  let textColor = 'var(--ink)';
  let badgeText = '';
  let badgeBg = '';

  if (isTraceability) {
    rowBg = '#e2efda';
    rowBorder = '#375623';
    textColor = '#375623';
    badgeText = 'Traçabilité';
    badgeBg = '#375623';
  } else if (isTerrain) {
    rowBg = 'rgba(37, 188, 116, 0.08)';
    rowBorder = '#25bc74';
    badgeText = 'Sur site';
    badgeBg = '#25bc74';
  } else if (isFixed) {
    rowBg = 'rgba(128, 128, 128, 0.06)';
    rowBorder = '#808080';
    textColor = '#808080';
  }

  return (
    <div
      className="rounded-lg border p-3 transition-all duration-200"
      style={{
        backgroundColor: rowBg,
        borderColor: rowBorder,
        borderLeftWidth: 4,
        borderLeftColor: isTraceability ? '#375623' : isTerrain ? '#25bc74' : isFixed ? '#808080' : 'var(--accent-soft)',
        cursor: isFixed ? 'default' : 'pointer',
      }}
    >
      <div className="flex items-center gap-3">
        {!isFixed && (
          <div className="flex flex-col gap-0.5 text-xs" style={{ color: 'var(--muted)' }}>
            <button
              onClick={() => onMoveUp?.(activity.id)}
              disabled={isFirst}
              className={`p-0.5 rounded hover:bg-black/5 transition ${isFirst ? 'opacity-20' : ''}`}
              title="Déplacer vers le haut"
            >▲</button>
            <button
              onClick={() => onMoveDown?.(activity.id)}
              disabled={isLast}
              className={`p-0.5 rounded hover:bg-black/5 transition ${isLast ? 'opacity-20' : ''}`}
              title="Déplacer vers le bas"
            >▼</button>
          </div>
        )}

        <div className="flex items-center gap-1.5 min-w-[70px]">
          <Clock size={14} style={{ color: '#8b1a1a' }} />
          <span className="text-sm font-medium" style={{ color: '#8b1a1a' }}>{activity.time}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium truncate" style={{ color: textColor }}>
              {activity.description}
            </span>
            {badgeText && (
              <span className="text-xs px-2 py-0.5 rounded-full text-white font-medium" style={{ backgroundColor: badgeBg }}>
                {badgeText}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            {activity.chapterIFS && (
              <span className="text-xs" style={{ color: 'var(--muted)' }}>
                IFS: {activity.chapterIFS}
              </span>
            )}
            {activity.chapterBRC && (
              <span className="text-xs" style={{ color: 'var(--muted)' }}>
                BRC: {activity.chapterBRC}
              </span>
            )}
          </div>
        </div>

        {!isFixed && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleOnSite(activity.id)}
              className={`p-1.5 rounded-lg transition-all ${activity.isOnSite ? 'text-white' : ''}`}
              style={{
                backgroundColor: activity.isOnSite ? '#25bc74' : 'transparent',
                border: activity.isOnSite ? 'none' : '1px solid var(--accent-soft)',
              }}
              title={activity.isOnSite ? 'Sur site' : 'Hors site'}
            >
              {activity.isOnSite ? <Sun size={14} /> : <SunDim size={14} style={{ color: 'var(--muted)' }} />}
            </button>

            <div className="flex items-center gap-1">
              <input
                type="number"
                value={activity.duration}
                onChange={(e) => {
                  const v = parseInt(e.target.value);
                  if (v >= 15 && v <= 480) onDurationChange(activity.id, v);
                }}
                className="w-16 px-2 py-1 text-sm rounded border text-center"
                style={{
                  borderColor: 'var(--accent-soft)',
                  backgroundColor: 'var(--bg-soft)',
                  color: 'var(--ink)',
                }}
                min={15}
                max={480}
                step={15}
              />
              <span className="text-xs" style={{ color: 'var(--muted)' }}>min</span>
            </div>

            {totalDays > 1 && onMoveToDay && (
              <select
                value={currentDay}
                onChange={(e) => onMoveToDay(activity.id, parseInt(e.target.value))}
                className="px-1.5 py-1 text-xs rounded border"
                style={{
                  borderColor: 'var(--accent-soft)',
                  backgroundColor: 'var(--bg-soft)',
                  color: 'var(--ink)',
                }}
                title="Déplacer vers un autre jour"
              >
                {Array.from({ length: totalDays }, (_, i) => i + 1).map(d => (
                  <option key={d} value={d}>
                    J{d}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}
      </div>

      {isFixed && (
        <div className="text-xs mt-1" style={{ color: '#808080' }}>
          Ligne fixe (non modifiable)
        </div>
      )}
    </div>
  );
}
