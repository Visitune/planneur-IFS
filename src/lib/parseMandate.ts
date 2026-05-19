import * as XLSX from 'xlsx';
import { MandateData } from './types';

const SHEET_KEYWORDS = ['mandat', 'notification de mission', 'notification'];

const CELL_MAP: Record<string, keyof MandateData> = {
  C7: 'companyName',
  C8: 'website',
  C9: 'coid',
  C12: 'address',
  C26: 'contactName',
  C27: 'contactMail',
  C43: 'auditType',
  C44: 'referential',
  C45: 'auditWindow',
  C46: 'scope',
  C47: 'exclusion',
  C49: 'productExamples',
  C50: 'technologySectors',
  C51: 'processSteps',
  C59: 'auditOrganization',
  C60: 'duration',
  C65: 'dates',
  C68: 'leadAuditor',
};

const FALLBACK_LABELS: Record<string, RegExp[]> = {
  companyName: [/raison\s*sociale/i, /société/i, /entreprise/i, /company/i],
  address: [/adresse/i, /siège/i, /address/i],
  leadAuditor: [/auditeur\s*principal/i, /lead\s*auditor/i],
  contactName: [/contact/i, /personne\s*à\s*contacter/i],
  duration: [/durée/i, /duration/i, /nombre\s*de\s*jours/i],
  referential: [/référentiel/i, /referential/i, /standard/i],
  scope: [/périmètre/i, /scope/i, /perimetre/i],
  dates: [/date/i, /période/i, /periode/i, /window/i],
};

function findSheet(workbook: XLSX.WorkBook): string {
  const sheetNames = workbook.SheetNames.map(s => s.toLowerCase());
  for (const keyword of SHEET_KEYWORDS) {
    const idx = sheetNames.findIndex(s => s.includes(keyword));
    if (idx >= 0) return workbook.SheetNames[idx];
  }
  return workbook.SheetNames[0];
}

function fallbackSearch(sheet: XLSX.WorkSheet, field: keyof MandateData): string {
  const patterns = FALLBACK_LABELS[field];
  if (!patterns) return '';

  const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1:Z100');
  for (let row = range.s.r; row <= range.e.r; row++) {
    for (let col = range.s.c; col <= range.e.c; col++) {
      const addr = XLSX.utils.encode_cell({ r: row, c: col });
      const cell = sheet[addr];
      if (cell) {
        const val = String(cell.v).trim();
        for (const pattern of patterns) {
          if (pattern.test(val)) {
            const nextAddr = XLSX.utils.encode_cell({ r: row, c: col + 1 });
            const nextCell = sheet[nextAddr];
            if (nextCell) {
              return String(nextCell.v).trim();
            }
          }
        }
      }
    }
  }
  return '';
}

export interface ParseResult {
  success: boolean;
  data?: MandateData;
  error?: string;
}

export function parseMandateFile(buffer: ArrayBuffer): ParseResult {
  try {
    const workbook = XLSX.read(buffer, { type: 'array' });
    const sheetName = findSheet(workbook);
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) {
      return { success: false, error: 'Aucune feuille trouvée dans le fichier Excel' };
    }

    const raw: Record<string, string> = {};
    for (const [cellRef, field] of Object.entries(CELL_MAP)) {
      const cell = sheet[cellRef];
      raw[field] = cell ? String(cell.v).trim() : '';
    }

    for (const field of Object.keys(FALLBACK_LABELS) as (keyof MandateData)[]) {
      if (!raw[field]) {
        const fallback = fallbackSearch(sheet, field);
        if (fallback) raw[field] = fallback;
      }
    }

    const duration = parseFloat(raw.duration) || 3;

    const data: MandateData = {
      companyName: raw.companyName || '',
      website: raw.website || '',
      coid: raw.coid || '',
      address: raw.address || '',
      contactName: raw.contactName || '',
      contactMail: raw.contactMail || '',
      auditType: raw.auditType || '',
      referential: raw.referential || '',
      auditWindow: raw.auditWindow || '',
      scope: raw.scope || '',
      exclusion: raw.exclusion || '',
      productExamples: raw.productExamples || '',
      technologySectors: raw.technologySectors || '',
      processSteps: raw.processSteps || '',
      auditOrganization: raw.auditOrganization || '',
      duration: isNaN(duration) ? 3 : duration,
      dates: raw.dates || '',
      leadAuditor: raw.leadAuditor || '',
    };

    return { success: true, data };
  } catch (err) {
    return { success: false, error: `Erreur de lecture du fichier: ${err instanceof Error ? err.message : 'Format invalide'}` };
  }
}

export function detectReferentialType(referential: string): 'IFS' | 'IFS+BRC' {
  const lower = referential.toLowerCase();
  if (lower.includes('brc')) return 'IFS+BRC';
  return 'IFS';
}

export function detectAnnounced(auditType: string): boolean {
  const lower = auditType.toLowerCase();
  return !lower.includes('non annoncé') && !lower.includes('non annonce') && !lower.includes('inopiné') && !lower.includes('inopine');
}
