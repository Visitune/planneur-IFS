'use client';

import { useState, useCallback, useEffect } from 'react';
import Header from '@/components/Header';
import MandateUploader from '@/components/MandateUploader';
import MandatePreview from '@/components/MandatePreview';
import TemplateSelector from '@/components/TemplateSelector';
import PlanningEditor from '@/components/PlanningEditor';
import ValidationPanel from '@/components/ValidationPanel';
import DocxPreview from '@/components/DocxPreview';
import { MandateData, AuditPlan, DayPlan, Activity, ValidationResult, AppStep } from '@/lib/types';
import { parseMandateFile, detectReferentialType, detectAnnounced } from '@/lib/parseMandate';
import { IFSScheduleActivity } from '@/lib/ifs-food-v8';
import { IFsBrcScheduleActivity } from '@/lib/ifs-brc-v9';
import { matchTemplate } from '@/lib/templateMatcher';
import { validatePlan } from '@/lib/validation';

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

type ScheduleActivity = IFSScheduleActivity | IFsBrcScheduleActivity;

function getChapterIFS(a: ScheduleActivity): string {
  if (a.type === 'fixed') return '';
  if ('chapterIFS' in a) return a.chapterIFS;
  if ('chapterIds' in a) return a.chapterIds.join(', ');
  return '';
}

function getChapterBRC(a: ScheduleActivity): string | undefined {
  if (a.type === 'fixed') return undefined;
  if ('chapterBRC' in a) return a.chapterBRC;
  return undefined;
}

function getDuration(a: ScheduleActivity): number {
  if (a.type === 'fixed') return 0;
  return a.duration;
}

function getIsOnSite(a: ScheduleActivity): boolean {
  if (a.type === 'fixed') return false;
  return a.isOnSite;
}

async function buildPlanFromTemplate(
  mandate: MandateData,
  referentialType: 'IFS' | 'IFS+BRC',
  isAnnounced: boolean,
  durationDays: number
): Promise<AuditPlan> {
  const schedule = referentialType === 'IFS'
    ? (await import('@/lib/ifs-food-v8')).getDefaultIFSSchedule(durationDays, isAnnounced)
    : (await import('@/lib/ifs-brc-v9')).getCombinedSchedule(durationDays, isAnnounced);

  const days: DayPlan[] = schedule.map(sd => ({
    day: sd.day,
    label: `Jour ${sd.day}`,
    activities: sd.activities.map((a: ScheduleActivity, i: number) => ({
      id: `act-${sd.day}-${i}-${generateId()}`,
      time: a.time,
      chapterIFS: getChapterIFS(a),
      chapterBRC: getChapterBRC(a),
      description: a.label,
      duration: getDuration(a) || 30,
      isOnSite: getIsOnSite(a),
      isFixed: a.type === 'fixed',
      isTraceability: a.label.toLowerCase().includes('traçabilité') || a.label.toLowerCase().includes('tracabilite'),
      day: sd.day,
    })),
  }));

  return {
    mandate,
    referentialType,
    isAnnounced,
    durationDays,
    days,
  };
}

export default function Home() {
  const [step, setStep] = useState<AppStep>('upload');
  const [mandate, setMandate] = useState<MandateData | null>(null);
  const [plan, setPlan] = useState<AuditPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [validations, setValidations] = useState<ValidationResult[]>([]);

  const [config, setConfig] = useState({
    referentialType: 'IFS' as 'IFS' | 'IFS+BRC',
    isAnnounced: true,
    durationDays: 3,
  });

  const handleFileLoaded = useCallback((buffer: ArrayBuffer, fileName: string) => {
    setLoading(true);
    setTimeout(() => {
      const result = parseMandateFile(buffer);
      if (result.success && result.data) {
        setMandate(result.data);
        const refType = detectReferentialType(result.data.referential);
        const announced = detectAnnounced(result.data.auditType);
        const days = result.data.duration || 3;
        setConfig({
          referentialType: refType,
          isAnnounced: announced,
          durationDays: days >= 2 && days <= 5 ? Math.round(days) : 3,
        });
        setStep('preview');
      }
      setLoading(false);
    }, 300);
  }, []);

  const handlePreviewConfirm = useCallback(() => {
    setStep('configure');
  }, []);

  const handleConfigConfirm = useCallback(async () => {
    if (!mandate) return;
    const newPlan = await buildPlanFromTemplate(
      mandate,
      config.referentialType,
      config.isAnnounced,
      config.durationDays
    );
    setPlan(newPlan);
    setValidations(validatePlan(newPlan));
    setStep('edit');
  }, [mandate, config]);

  const handlePlanUpdate = useCallback((updated: AuditPlan) => {
    setPlan(updated);
    setValidations(validatePlan(updated));
  }, []);

  const handleEditConfirm = useCallback(() => {
    setStep('generate');
  }, []);

  const handleReset = useCallback(() => {
    setMandate(null);
    setPlan(null);
    setValidations([]);
    setStep('upload');
  }, []);

  const stepLabels: Record<AppStep, string> = {
    upload: '1. Chargement',
    preview: '2. Vérification',
    configure: '3. Configuration',
    edit: '4. Édition',
    generate: '5. Génération',
  };

  const stepOrder: AppStep[] = ['upload', 'preview', 'configure', 'edit', 'generate'];
  const currentIdx = stepOrder.indexOf(step);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg)' }}>
      <Header />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6 space-y-6 animate-fade-in">
        <div className="flex items-center gap-2">
          {stepOrder.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  i <= currentIdx ? 'text-white' : ''
                }`}
                style={{
                  backgroundColor: i <= currentIdx ? 'var(--accent)' : 'var(--accent-soft)',
                  color: i <= currentIdx ? 'white' : 'var(--muted)',
                }}
              >
                {i + 1}
              </div>
              <span
                className="text-xs font-medium hidden sm:inline"
                style={{
                  color: i <= currentIdx ? 'var(--ink)' : 'var(--muted)',
                }}
              >
                {stepLabels[s]}
              </span>
              {i < stepOrder.length - 1 && (
                <div
                  className="w-6 h-px hidden sm:block"
                  style={{ backgroundColor: 'var(--accent-soft)' }}
                />
              )}
            </div>
          ))}
        </div>

        {step === 'upload' && (
          <MandateUploader onFileLoaded={handleFileLoaded} loading={loading} />
        )}

        {step === 'preview' && mandate && (
          <MandatePreview
            data={mandate}
            onConfirm={handlePreviewConfirm}
            onBack={handleReset}
          />
        )}

        {step === 'configure' && (
          <TemplateSelector
            referentialType={config.referentialType}
            isAnnounced={config.isAnnounced}
            durationDays={config.durationDays}
            onReferentialChange={(v) => setConfig(p => ({ ...p, referentialType: v }))}
            onAnnouncedChange={(v) => setConfig(p => ({ ...p, isAnnounced: v }))}
            onDurationChange={(v) => setConfig(p => ({ ...p, durationDays: v }))}
            onConfirm={handleConfigConfirm}
            onBack={() => setStep('preview')}
          />
        )}

        {step === 'edit' && plan && (
          <div className="space-y-4">
            <PlanningEditor
              plan={plan}
              onUpdatePlan={handlePlanUpdate}
              onConfirm={handleEditConfirm}
              onBack={() => setStep('configure')}
            />
            <ValidationPanel results={validations} />
          </div>
        )}

        {step === 'generate' && plan && (
          <DocxPreview
            plan={plan}
            onBack={() => setStep('edit')}
            onReset={handleReset}
          />
        )}
      </main>
      <footer className="py-4 text-center text-xs" style={{ color: 'var(--muted)' }}>
        Audit Planner Ecocert v2.0 · Génération de plans d&apos;audit IFS/BRC
      </footer>
    </div>
  );
}
