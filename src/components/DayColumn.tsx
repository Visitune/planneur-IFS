'use client';

import { DayPlan } from '@/lib/types';
import ActivityRow from './ActivityRow';

interface Props {
  day: DayPlan;
  onToggleOnSite: (activityId: string) => void;
  onDurationChange: (activityId: string, duration: number) => void;
  onMoveUp: (activityId: string) => void;
  onMoveDown: (activityId: string) => void;
  onMoveToDay: (activityId: string, targetDay: number) => void;
  totalDays: number;
}

export default function DayColumn({
  day, onToggleOnSite, onDurationChange,
  onMoveUp, onMoveDown, onMoveToDay, totalDays,
}: Props) {
  const totalMinutes = day.activities
    .filter(a => !a.isFixed)
    .reduce((sum, a) => sum + a.duration, 0);

  const terrainMinutes = day.activities
    .filter(a => a.isOnSite && !a.isFixed)
    .reduce((sum, a) => sum + a.duration, 0);

  const terrainPercent = totalMinutes > 0 ? Math.round((terrainMinutes / totalMinutes) * 100) : 0;

  return (
    <div className="flex-1 min-w-[300px] space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold" style={{ color: 'var(--ink)' }}>
          Jour {day.day}
        </h3>
        <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--muted)' }}>
          <span>{totalMinutes}min total</span>
          <span style={{ color: terrainPercent >= 50 ? '#25bc74' : '#b6452c' }}>
            {terrainPercent}% terrain
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {day.activities.map((activity, idx) => (
          <ActivityRow
            key={activity.id}
            activity={activity}
            onToggleOnSite={onToggleOnSite}
            onDurationChange={onDurationChange}
            isFirst={idx === 0}
            isLast={idx === day.activities.length - 1}
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
            onMoveToDay={onMoveToDay}
            totalDays={totalDays}
            currentDay={day.day}
          />
        ))}
      </div>
    </div>
  );
}
