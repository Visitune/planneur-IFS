'use client';

import { AVAILABLE_DURATIONS } from '@/lib/constants';

interface Props {
  referentialType: 'IFS' | 'IFS+BRC';
  isAnnounced: boolean;
  durationDays: number;
  onReferentialChange: (v: 'IFS' | 'IFS+BRC') => void;
  onAnnouncedChange: (v: boolean) => void;
  onDurationChange: (v: number) => void;
  onConfirm: () => void;
  onBack: () => void;
}

export default function TemplateSelector({
  referentialType, isAnnounced, durationDays,
  onReferentialChange, onAnnouncedChange, onDurationChange,
  onConfirm, onBack,
}: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold" style={{ color: 'var(--ink)' }}>
        3. Configurer le plan d&apos;audit
      </h2>
      <div className="rounded-xl p-6 space-y-6" style={{ backgroundColor: 'var(--paper)', border: '1px solid var(--accent-soft)' }}>
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--ink)' }}>Référentiel</label>
          <div className="flex gap-3">
            {(['IFS', 'IFS+BRC'] as const).map(opt => (
              <button
                key={opt}
                onClick={() => onReferentialChange(opt)}
                className="flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all border-2"
                style={{
                  borderColor: referentialType === opt ? 'var(--accent)' : 'var(--accent-soft)',
                  backgroundColor: referentialType === opt ? 'var(--accent-soft)' : 'transparent',
                  color: referentialType === opt ? 'var(--accent-dark)' : 'var(--ink)',
                }}
              >
                {opt === 'IFS' ? 'IFS Food V8' : 'IFS Food V8 + BRC Food V9'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--ink)' }}>Type d&apos;audit</label>
          <div className="flex gap-3">
            {[
              { value: true, label: 'Annoncé' },
              { value: false, label: 'Non annoncé' },
            ].map(opt => (
              <button
                key={String(opt.value)}
                onClick={() => onAnnouncedChange(opt.value)}
                className="flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all border-2"
                style={{
                  borderColor: isAnnounced === opt.value ? 'var(--accent)' : 'var(--accent-soft)',
                  backgroundColor: isAnnounced === opt.value ? 'var(--accent-soft)' : 'transparent',
                  color: isAnnounced === opt.value ? 'var(--accent-dark)' : 'var(--ink)',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--ink)' }}>Durée (jours)</label>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_DURATIONS.map(d => (
              <button
                key={d}
                onClick={() => onDurationChange(d)}
                className="px-3 py-2 rounded-lg text-sm font-medium transition-all border"
                style={{
                  borderColor: durationDays === d ? 'var(--accent)' : 'var(--accent-soft)',
                  backgroundColor: durationDays === d ? 'var(--accent-soft)' : 'transparent',
                  color: durationDays === d ? 'var(--accent-dark)' : 'var(--ink)',
                }}
              >
                {d} j{d >= 2 ? 's' : ''}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
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
          Générer le planning
        </button>
      </div>
    </div>
  );
}
