import { TemplateConfig } from './types';
import { AVAILABLE_DURATIONS } from './constants';

export function matchTemplate(
  durationDays: number,
  referentialType: 'IFS' | 'IFS+BRC',
  isAnnounced: boolean
): TemplateConfig {
  const closest = AVAILABLE_DURATIONS.reduce((prev, curr) =>
    Math.abs(curr - durationDays) < Math.abs(prev - durationDays) ? curr : prev
  );

  return {
    referentialType,
    isAnnounced,
    durationDays: closest,
  };
}

export function getTemplateLabel(config: TemplateConfig): string {
  const ref = config.referentialType === 'IFS' ? 'IFS Food V8' : 'IFS Food V8 & BRC Food V9';
  const mode = config.isAnnounced ? 'Annoncé' : 'Non annoncé';
  return `F-IFS-08 ${ref} ${config.durationDays} jours ${mode}`;
}
