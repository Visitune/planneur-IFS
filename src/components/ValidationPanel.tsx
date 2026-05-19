'use client';

import { ValidationResult } from '@/lib/types';
import { CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';

interface Props {
  results: ValidationResult[];
}

const ICON_MAP: Record<string, typeof CheckCircle> = {
  'check-circle': CheckCircle,
  'alert-triangle': AlertTriangle,
  'info': Info,
  'x-circle': XCircle,
};

export default function ValidationPanel({ results }: Props) {
  if (results.length === 0) return null;

  const errorCount = results.filter(r => r.type === 'error').length;
  const warningCount = results.filter(r => r.type === 'warning').length;

  return (
    <div className="rounded-xl border p-4 space-y-2" style={{
      borderColor: errorCount > 0 ? '#b6452c' : warningCount > 0 ? '#e2efda' : '#5e7d62',
      backgroundColor: errorCount > 0 ? 'rgba(182, 69, 44, 0.05)' : 'var(--paper)',
    }}>
      <div className="flex items-center gap-2 mb-2">
        <h4 className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>Validation du planning</h4>
        {errorCount > 0 && (
          <span className="text-xs px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: '#b6452c' }}>
            {errorCount} erreur{errorCount > 1 ? 's' : ''}
          </span>
        )}
        {warningCount > 0 && (
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#e2efda', color: '#375623' }}>
            {warningCount} avertissement{warningCount > 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div className="space-y-1.5">
        {results.map((r, i) => {
          const Icon = ICON_MAP[r.icon] || Info;
          const iconColor = r.type === 'error' ? '#b6452c' : r.type === 'warning' ? '#375623' : '#5e7d62';
          return (
            <div key={i} className="flex items-start gap-2 text-sm">
              <Icon size={14} style={{ color: iconColor, marginTop: 2, flexShrink: 0 }} />
              <span style={{ color: r.type === 'error' ? '#b6452c' : 'var(--ink)' }}>
                {r.message}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
