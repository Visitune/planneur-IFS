'use client';

import { Clock } from 'lucide-react';

interface Props {
  day: number;
  time: string;
  dayLabel: string;
  onDayChange: (day: number) => void;
  onTimeChange: (time: string) => void;
  totalDays: number;
}

export default function TraceabilityMarker({
  day, time, dayLabel, onDayChange, onTimeChange, totalDays,
}: Props) {
  const [h, m] = time.split('h');
  const hourNum = parseInt(h);
  const minNum = parseInt(m || '0');

  const timePlus4 = `${Math.min(hourNum + 4, 23)}h${minNum.toString().padStart(2, '0')}`;

  return (
    <div className="rounded-lg border p-4 space-y-3" style={{ borderColor: '#375623', backgroundColor: '#e2efda' }}>
      <div className="flex items-center gap-2">
        <Clock size={16} style={{ color: '#375623' }} />
        <h4 className="text-sm font-semibold" style={{ color: '#375623' }}>
          Test de traçabilité
        </h4>
      </div>

      <div className="flex flex-wrap gap-4">
        <div>
          <label className="block text-xs mb-1" style={{ color: '#375623' }}>Jour</label>
          <select
            value={day}
            onChange={(e) => onDayChange(parseInt(e.target.value))}
            className="px-3 py-1.5 text-sm rounded border"
            style={{ borderColor: '#375623', backgroundColor: 'white', color: 'var(--ink)' }}
          >
            {Array.from({ length: totalDays }, (_, i) => i + 1).map(d => (
              <option key={d} value={d}>Jour {d}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs mb-1" style={{ color: '#375623' }}>Heure de lancement</label>
          <input
            type="time"
            value={`${hourNum.toString().padStart(2, '0')}:${minNum.toString().padStart(2, '0')}`}
            onChange={(e) => {
              const [nh, nm] = e.target.value.split(':');
              onTimeChange(`${parseInt(nh)}h${nm}`);
            }}
            className="px-3 py-1.5 text-sm rounded border"
            style={{ borderColor: '#375623', backgroundColor: 'white', color: 'var(--ink)' }}
          />
        </div>
      </div>

      <div className="text-xs" style={{ color: '#375623' }}>
        Documents disponibles à partir de <strong>{dayLabel} {timePlus4}</strong>
        {' '}(lancement + 4h)
      </div>
    </div>
  );
}
