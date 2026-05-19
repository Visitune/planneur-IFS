'use client';

import { useState } from 'react';
import { AuditPlan } from '@/lib/types';
import { generateAuditPlanDocx } from '@/lib/generatePlanDocx';
import { generateBilanDocx } from '@/lib/generateBilanDocx';
import { FileText, FileSpreadsheet, X, Download, Eye, Loader2 } from 'lucide-react';

interface Props {
  plan: AuditPlan;
  onBack: () => void;
  onReset: () => void;
}

export default function DocxPreview({ plan, onBack, onReset }: Props) {
  const [generating, setGenerating] = useState<'plan' | 'bilan' | 'both' | null>(null);
  const [preview, setPreview] = useState<{ html: string; title: string } | null>(null);

  const handleDownload = async (type: 'plan' | 'bilan') => {
    setGenerating(type);
    try {
      const blob = type === 'plan'
        ? await generateAuditPlanDocx(plan)
        : await generateBilanDocx(plan);

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = type === 'plan'
        ? `Plan_Audit_${plan.mandate.companyName.replace(/[^a-zA-Z0-9]/g, '_')}.docx`
        : `Bilan_Cloture_${plan.mandate.companyName.replace(/[^a-zA-Z0-9]/g, '_')}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Generation error:', err);
    }
    setGenerating(null);
  };

  const handleDownloadAll = async () => {
    setGenerating('both');
    try {
      const [planBlob, bilanBlob] = await Promise.all([
        generateAuditPlanDocx(plan),
        generateBilanDocx(plan),
      ]);

      const download = (blob: Blob, name: string) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      };

      download(planBlob, `Plan_Audit_${plan.mandate.companyName.replace(/[^a-zA-Z0-9]/g, '_')}.docx`);
      setTimeout(() => {
        download(bilanBlob, `Bilan_Cloture_${plan.mandate.companyName.replace(/[^a-zA-Z0-9]/g, '_')}.docx`);
      }, 500);
    } catch (err) {
      console.error('Generation error:', err);
    }
    setGenerating(null);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold" style={{ color: 'var(--ink)' }}>
        5. Documents générés
      </h2>

      <div className="rounded-xl p-6 space-y-4" style={{ backgroundColor: 'var(--paper)', border: '1px solid var(--accent-soft)' }}>
        <div className="text-sm" style={{ color: 'var(--muted)' }}>
          <span className="font-medium" style={{ color: 'var(--ink)' }}>{plan.mandate.companyName}</span>
          {' '}| {plan.mandate.referential} | {plan.durationDays} jours | {plan.mandate.leadAuditor}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => handleDownload('plan')}
            disabled={generating !== null}
            className="flex items-center gap-3 p-4 rounded-xl border transition-all hover:scale-[1.02] disabled:opacity-50"
            style={{ borderColor: 'var(--accent-soft)', backgroundColor: 'var(--bg-soft)' }}
          >
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--accent-soft)' }}>
              {generating === 'plan' ? <Loader2 size={20} className="animate-spin" style={{ color: 'var(--accent)' }} /> : <FileText size={20} style={{ color: 'var(--accent)' }} />}
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm font-medium" style={{ color: 'var(--ink)' }}>Plan d&apos;audit</div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>F-IFS-08 · Document Word</div>
            </div>
            <Download size={16} style={{ color: 'var(--accent)' }} />
          </button>

          <button
            onClick={() => handleDownload('bilan')}
            disabled={generating !== null}
            className="flex items-center gap-3 p-4 rounded-xl border transition-all hover:scale-[1.02] disabled:opacity-50"
            style={{ borderColor: 'var(--accent-soft)', backgroundColor: 'var(--bg-soft)' }}
          >
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--sage-light)' }}>
              {generating === 'bilan' ? <Loader2 size={20} className="animate-spin" style={{ color: 'var(--sage)' }} /> : <FileSpreadsheet size={20} style={{ color: 'var(--sage)' }} />}
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm font-medium" style={{ color: 'var(--ink)' }}>Bilan de clôture</div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>F-IFS-15 · Document Word</div>
            </div>
            <Download size={16} style={{ color: 'var(--sage)' }} />
          </button>
        </div>

        <button
          onClick={handleDownloadAll}
          disabled={generating !== null}
          className="w-full py-3 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          {generating === 'both' ? (
            <><Loader2 size={16} className="animate-spin" /> Génération en cours...</>
          ) : (
            <><Download size={16} /> Télécharger les deux documents</>
          )}
        </button>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
          style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }}
        >
          Modifier le planning
        </button>
        <button
          onClick={onReset}
          className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
          style={{ backgroundColor: 'transparent', color: 'var(--muted)', border: '1px solid var(--accent-soft)' }}
        >
          Nouveau mandat
        </button>
      </div>

      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setPreview(null)}>
          <div className="max-w-4xl w-full mx-4 max-h-[80vh] rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--paper)' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--accent-soft)' }}>
              <h3 className="font-semibold" style={{ color: 'var(--ink)' }}>{preview.title}</h3>
              <button onClick={() => setPreview(null)} className="p-1 rounded hover:bg-black/5">
                <X size={18} />
              </button>
            </div>
            <div className="p-4 max-h-[70vh] overflow-y-auto" dangerouslySetInnerHTML={{ __html: preview.html }} />
          </div>
        </div>
      )}
    </div>
  );
}
