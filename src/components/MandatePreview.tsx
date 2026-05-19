'use client';

import { MandateData } from '@/lib/types';
import { FileText } from 'lucide-react';

interface Props {
  data: MandateData;
  onConfirm: () => void;
  onBack: () => void;
}

const LOCKED_FIELDS = ['companyName', 'dates', 'duration', 'leadAuditor'] as const;

export default function MandatePreview({ data, onConfirm, onBack }: Props) {
  const fields: { label: string; key: keyof MandateData; value: string }[] = [
    { label: 'Raison Sociale', key: 'companyName', value: data.companyName },
    { label: 'Site Web', key: 'website', value: data.website },
    { label: 'COID', key: 'coid', value: data.coid },
    { label: 'Adresse', key: 'address', value: data.address },
    { label: 'Contact', key: 'contactName', value: data.contactName },
    { label: 'Email Contact', key: 'contactMail', value: data.contactMail },
    { label: "Type d'audit", key: 'auditType', value: data.auditType },
    { label: 'Référentiel', key: 'referential', value: data.referential },
    { label: 'Fenêtre d\'audit', key: 'auditWindow', value: data.auditWindow },
    { label: 'Périmètre', key: 'scope', value: data.scope },
    { label: 'Exclusions', key: 'exclusion', value: data.exclusion || 'Aucune' },
    { label: 'Exemples produits', key: 'productExamples', value: data.productExamples },
    { label: 'Secteurs technologiques', key: 'technologySectors', value: data.technologySectors },
    { label: 'Étapes processus', key: 'processSteps', value: data.processSteps },
    { label: 'Organisme d\'audit', key: 'auditOrganization', value: data.auditOrganization },
    { label: 'Durée (jours)', key: 'duration', value: `${data.duration}` },
    { label: 'Dates', key: 'dates', value: data.dates },
    { label: 'Auditeur principal', key: 'leadAuditor', value: data.leadAuditor },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold" style={{ color: 'var(--ink)' }}>
        2. Données extraites du mandat
      </h2>
      <div className="rounded-xl overflow-hidden border" style={{ borderColor: 'var(--accent-soft)', backgroundColor: 'var(--paper)' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px">
          {fields.map(({ label, key, value }) => {
            const isLocked = (LOCKED_FIELDS as readonly string[]).includes(key);
            return (
              <div key={key} className="p-3 flex flex-col gap-1" style={{ backgroundColor: 'var(--bg)' }}>
                <span className="text-xs font-medium" style={{ color: 'var(--muted)' }}>{label}</span>
                <span className="text-sm" style={{ color: isLocked ? 'var(--accent-dark)' : 'var(--ink)', fontWeight: isLocked ? 600 : 400 }}>
                  {value || <span style={{ color: 'var(--muted)' }}>Non renseigné</span>}
                  {isLocked && <span className="ml-2 text-xs opacity-60">(verrouillé)</span>}
                </span>
              </div>
            );
          })}
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
          className="px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90 flex items-center gap-2"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          <FileText size={16} />
          Configurer le plan d&apos;audit
        </button>
      </div>
    </div>
  );
}
