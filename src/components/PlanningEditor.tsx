'use client';

import { useState, useCallback } from 'react';
import { AuditPlan, DayPlan, Activity } from '@/lib/types';
import DayColumn from './DayColumn';
import TraceabilityMarker from './TraceabilityMarker';

interface Props {
  plan: AuditPlan;
  onUpdatePlan: (plan: AuditPlan) => void;
  onConfirm: () => void;
  onBack: () => void;
}

export default function PlanningEditor({ plan, onUpdatePlan, onConfirm, onBack }: Props) {
  const [showTraceability, setShowTraceability] = useState(!!plan.traceabilityMarker);

  const updateDay = useCallback((dayIndex: number, updater: (day: DayPlan) => DayPlan) => {
    const newDays = [...plan.days];
    newDays[dayIndex] = updater(newDays[dayIndex]);
    onUpdatePlan({ ...plan, days: newDays });
  }, [plan, onUpdatePlan]);

  const toggleOnSite = useCallback((activityId: string) => {
    for (let d = 0; d < plan.days.length; d++) {
      const actIdx = plan.days[d].activities.findIndex(a => a.id === activityId);
      if (actIdx >= 0) {
        updateDay(d, day => {
          const activities = [...day.activities];
          activities[actIdx] = { ...activities[actIdx], isOnSite: !activities[actIdx].isOnSite };
          return { ...day, activities };
        });
        return;
      }
    }
  }, [plan, updateDay]);

  const changeDuration = useCallback((activityId: string, duration: number) => {
    for (let d = 0; d < plan.days.length; d++) {
      const actIdx = plan.days[d].activities.findIndex(a => a.id === activityId);
      if (actIdx >= 0) {
        updateDay(d, day => {
          const activities = [...day.activities];
          activities[actIdx] = { ...activities[actIdx], duration };
          return { ...day, activities };
        });
        return;
      }
    }
  }, [plan, updateDay]);

  const moveActivity = useCallback((activityId: string, direction: 'up' | 'down') => {
    for (let d = 0; d < plan.days.length; d++) {
      const activities = plan.days[d].activities;
      const idx = activities.findIndex(a => a.id === activityId);
      if (idx >= 0 && !activities[idx].isFixed) {
        const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
        if (swapIdx >= 0 && swapIdx < activities.length && !activities[swapIdx].isFixed) {
          updateDay(d, day => {
            const newActs = [...day.activities];
            [newActs[idx], newActs[swapIdx]] = [newActs[swapIdx], newActs[idx]];
            return { ...day, activities: newActs };
          });
        }
        return;
      }
    }
  }, [plan, updateDay]);

  const moveToDay = useCallback((activityId: string, targetDay: number) => {
    if (targetDay < 1 || targetDay > plan.days.length) return;

    let sourceDayIdx = -1;
    let actIdx = -1;
    let activity: Activity | null = null;

    for (let d = 0; d < plan.days.length; d++) {
      const idx = plan.days[d].activities.findIndex(a => a.id === activityId);
      if (idx >= 0) {
        sourceDayIdx = d;
        actIdx = idx;
        activity = plan.days[d].activities[idx];
        break;
      }
    }

    if (!activity || activity.isFixed) return;

    const targetIdx = targetDay - 1;
    if (targetIdx === sourceDayIdx) return;

    const newDays = plan.days.map(d => ({ ...d, activities: [...d.activities] }));
    newDays[sourceDayIdx].activities.splice(actIdx, 1);
    const insertBeforeIdx = newDays[targetIdx].activities.findIndex(a => a.isFixed && a.time >= activity.time);
    const insertPos = insertBeforeIdx >= 0 ? insertBeforeIdx : newDays[targetIdx].activities.length;
    newDays[targetIdx].activities.splice(insertPos, 0, { ...activity, day: targetDay });

    onUpdatePlan({ ...plan, days: newDays });
  }, [plan, onUpdatePlan]);

  const handleTraceabilityDayChange = useCallback((day: number) => {
    const dayLabel = `Jour ${day}`;
    const time = plan.traceabilityMarker?.time || '09h30';
    onUpdatePlan({
      ...plan,
      traceabilityMarker: { day, time, dayLabel },
    });
  }, [plan, onUpdatePlan]);

  const handleTraceabilityTimeChange = useCallback((time: string) => {
    const day = plan.traceabilityMarker?.day || 1;
    const dayLabel = `Jour ${day}`;
    onUpdatePlan({
      ...plan,
      traceabilityMarker: { day, time, dayLabel },
    });
  }, [plan, onUpdatePlan]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold" style={{ color: 'var(--ink)' }}>
          4. Éditer le planning
        </h2>
        <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--muted)' }}>
          <span className="inline-block w-3 h-3 rounded" style={{ backgroundColor: '#375623' }} />
          Traçabilité
          <span className="inline-block w-3 h-3 rounded" style={{ backgroundColor: '#25bc74' }} />
          Sur site
          <span className="inline-block w-3 h-3 rounded" style={{ backgroundColor: '#808080' }} />
          Fixe
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {plan.days.map((day) => (
          <DayColumn
            key={day.day}
            day={day}
            onToggleOnSite={toggleOnSite}
            onDurationChange={changeDuration}
            onMoveUp={(id) => moveActivity(id, 'up')}
            onMoveDown={(id) => moveActivity(id, 'down')}
            onMoveToDay={moveToDay}
            totalDays={plan.days.length}
          />
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            if (showTraceability) {
              onUpdatePlan({ ...plan, traceabilityMarker: undefined });
            } else {
              onUpdatePlan({
                ...plan,
                traceabilityMarker: { day: 2, time: '09h30', dayLabel: 'Jour 2' },
              });
            }
            setShowTraceability(!showTraceability);
          }}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-all border"
          style={{
            borderColor: showTraceability ? '#375623' : 'var(--accent-soft)',
            backgroundColor: showTraceability ? '#e2efda' : 'var(--paper)',
            color: showTraceability ? '#375623' : 'var(--ink)',
          }}
        >
          {showTraceability ? '✓ Test traçabilité configuré' : '+ Ajouter test traçabilité'}
        </button>
      </div>

      {showTraceability && plan.traceabilityMarker && (
        <TraceabilityMarker
          day={plan.traceabilityMarker.day}
          time={plan.traceabilityMarker.time}
          dayLabel={plan.traceabilityMarker.dayLabel}
          onDayChange={handleTraceabilityDayChange}
          onTimeChange={handleTraceabilityTimeChange}
          totalDays={plan.days.length}
        />
      )}

      <div className="flex gap-3 pt-2">
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
          style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }}
        >
          Revenir
        </button>
        <button
          onClick={onConfirm}
          className="px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          Valider & Générer
        </button>
      </div>
    </div>
  );
}
