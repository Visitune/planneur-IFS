import { AuditPlan, ValidationResult } from './types';
import { MIN_TERRAIN_PERCENT, MAX_DAY_AMPLITUDE_MINUTES } from './constants';

function timeToMinutes(time: string): number {
  const match = time.match(/^(\d+)h(\d+)?$/);
  if (match) {
    return parseInt(match[1]) * 60 + (parseInt(match[2]) || 0);
  }
  const parts = time.split(/[h:]/);
  if (parts.length >= 2) {
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
  }
  return 0;
}

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h${m.toString().padStart(2, '0')}`;
}

export function validatePlan(plan: AuditPlan): ValidationResult[] {
  const results: ValidationResult[] = [];

  const totalMandateMinutes = Math.round(plan.durationDays * 8 * 60);

  let totalActivitiesMinutes = 0;
  let totalTerrainMinutes = 0;

  for (const day of plan.days) {
    for (const act of day.activities) {
      if (!act.isFixed) {
        totalActivitiesMinutes += act.duration;
        if (act.isOnSite) {
          totalTerrainMinutes += act.duration;
        }
      }
    }
  }

  const diff = Math.abs(totalActivitiesMinutes - totalMandateMinutes);
  if (diff > 30) {
    results.push({
      type: 'error',
      message: `Durée totale (${totalActivitiesMinutes}min) ne correspond pas au mandat (${totalMandateMinutes}min). Différence: ${diff}min`,
      icon: 'alert-triangle',
    });
  } else {
    results.push({
      type: 'success',
      message: `Durée totale: ${minutesToTime(totalActivitiesMinutes)} / ${minutesToTime(totalMandateMinutes)} (objectif mandat)`,
      icon: 'check-circle',
    });
  }

  const terrainPercent = totalActivitiesMinutes > 0 ? totalTerrainMinutes / totalActivitiesMinutes : 0;
  if (terrainPercent < MIN_TERRAIN_PERCENT) {
    results.push({
      type: 'error',
      message: `Temps sur site: ${Math.round(terrainPercent * 100)}% (< 50% requis). Minimum ${Math.round(MIN_TERRAIN_PERCENT * totalActivitiesMinutes)}min requis, actuellement ${totalTerrainMinutes}min`,
      icon: 'alert-triangle',
    });
  } else {
    results.push({
      type: 'success',
      message: `Temps sur site: ${Math.round(terrainPercent * 100)}% (≥50% requis)`,
      icon: 'check-circle',
    });
  }

  for (const day of plan.days) {
    const activities = day.activities;
    if (activities.length === 0) continue;

    const firstAct = activities[0];
    const lastAct = activities[activities.length - 1];
    const startMin = timeToMinutes(firstAct.time);
    let endMin = timeToMinutes(lastAct.time);
    if (lastAct.duration) endMin += lastAct.duration;

    const amplitude = endMin - startMin;
    if (amplitude > MAX_DAY_AMPLITUDE_MINUTES) {
      results.push({
        type: 'error',
        message: `Jour ${day.day}: amplitude ${minutesToTime(amplitude)} dépasse 9h maximum`,
        icon: 'alert-triangle',
      });
    } else {
      results.push({
        type: 'success',
        message: `Jour ${day.day}: amplitude ${minutesToTime(amplitude)} (≤9h)`,
        icon: 'check-circle',
      });
    }
  }

  const traceabilityAct = plan.days
    .flatMap(d => d.activities)
    .find(a => a.isTraceability);

  if (traceabilityAct && traceabilityAct.day === 1) {
    results.push({
      type: 'warning',
      message: 'Il est recommandé de placer la traçabilité au Jour 2 ou ultérieur',
      icon: 'info',
    });
  }

  for (const day of plan.days) {
    for (const act of day.activities) {
      if (!act.isFixed && act.duration % 15 !== 0) {
        results.push({
          type: 'warning',
          message: `"${act.description}" (Jour ${day.day}): la durée (${act.duration}min) doit être un multiple de 15min`,
          icon: 'info',
        });
      }
    }
  }

  return results;
}
