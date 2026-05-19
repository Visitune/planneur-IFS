import {
  Document, Packer, Paragraph, Table, TableRow, TableCell,
  TextRun, WidthType, AlignmentType, ShadingType, convertInchesToTwip
} from 'docx';
import { AuditPlan, Activity } from './types';
import { DOCX_COLORS } from './constants';

function buildHeaderRow(text: string, colSpan: number, color: string): TableRow {
  return new TableRow({
    tableHeader: true,
    children: [
      new TableCell({
        columnSpan: colSpan,
        shading: { type: ShadingType.CLEAR, fill: color },
        children: [new Paragraph({ children: [new TextRun({ text, bold: true, size: 18, color: 'FFFFFF' })] })],
      }),
    ],
  });
}

function buildCell(text: string, opts?: {
  width?: number;
  shading?: string;
  color?: string;
  bold?: boolean;
  size?: number;
  alignment?: (typeof AlignmentType)[keyof typeof AlignmentType];
}): TableCell {
  return new TableCell({
    width: opts?.width ? { size: opts.width, type: WidthType.DXA } : undefined,
    shading: opts?.shading ? { type: ShadingType.CLEAR, fill: opts.shading } : undefined,
    children: [
      new Paragraph({
        alignment: opts?.alignment ?? AlignmentType.LEFT,
        children: [
          new TextRun({
            text,
            bold: opts?.bold ?? false,
            size: opts?.size ?? 18,
            color: opts?.color ?? DOCX_COLORS.C_BLACK,
            font: 'Calibri',
          }),
        ],
      }),
    ],
  });
}

function buildActivityRow(act: Activity, isCombined: boolean, totalCols: number): TableRow {
  const isFixed = act.isFixed;
  const isTrace = act.isTraceability;
  const isTerrain = act.isOnSite && !act.isFixed;

  let bgColor: string = isFixed ? DOCX_COLORS.C_GREY_FIXED : DOCX_COLORS.C_WHITE;
  let textColor: string = DOCX_COLORS.C_BLACK;

  if (isTrace) {
    bgColor = DOCX_COLORS.C_GREEN_BG;
    textColor = DOCX_COLORS.C_GREEN_TEXT;
  } else if (isTerrain) {
    bgColor = DOCX_COLORS.C_GREEN_TERRAIN;
    textColor = DOCX_COLORS.C_WHITE_TEXT;
  } else if (isFixed) {
    textColor = DOCX_COLORS.C_WHITE_TEXT;
  }

  const cells: TableCell[] = [
    buildCell(act.time, { width: 1209, shading: bgColor, color: '8B1A1A', bold: true }),
    buildCell(act.chapterIFS || '', { width: 1243, shading: bgColor, color: textColor }),
  ];

  if (isCombined) {
    cells.push(buildCell(act.chapterBRC || '', { width: 1000, shading: bgColor, color: textColor }));
  }

  const remainingCols = totalCols - (isCombined ? 3 : 2);
  for (let i = 0; i < remainingCols; i++) {
    const label = i === 0 ? act.description : (i === 1 ? '' : '');
    cells.push(buildCell(label, { shading: bgColor, color: textColor }));
  }

  return new TableRow({ children: cells });
}

function buildHeaderInfoTable(plan: AuditPlan): Table {
  const { mandate } = plan;

  const rows: TableRow[] = [];

  const addRow = (label: string, value: string, isBold = false) => {
    rows.push(new TableRow({
      children: [
        buildCell(label, { width: 2500, shading: DOCX_COLORS.C_GREY_LABEL, bold: true, size: 16 }),
        buildCell(value, { size: 16, bold: isBold }),
      ],
    }));
  };

  addRow('Raison Sociale', mandate.companyName, true);
  addRow('Adresse', mandate.address);
  addRow('Contact', mandate.contactName);
  addRow('Email', mandate.contactMail);
  addRow("Type d'audit", mandate.auditType);
  addRow('Référentiel', mandate.referential);
  addRow('Périmètre', mandate.scope);
  addRow('Exclusions', mandate.exclusion || 'Aucune');
  addRow('Produits', mandate.productExamples);
  addRow('Secteurs technologiques', mandate.technologySectors);
  addRow('Durée', `${plan.durationDays} jours`);
  addRow('Dates', mandate.dates);
  addRow('Auditeur principal', mandate.leadAuditor, true);

  return new Table({
    rows: [
      buildHeaderRow('INFORMATIONS AUDIT', 2, DOCX_COLORS.C_RED_HEADER),
      ...rows,
    ],
  });
}

function timeToMinutes(time: string): number {
  const parts = time.replace('h', ':').split(':');
  return parseInt(parts[0]) * 60 + (parseInt(parts[1]) || 0);
}

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h${m.toString().padStart(2, '0')}`;
}

function buildDayTable(
  day: { day: number; label: string; activities: Activity[] },
  isCombined: boolean,
  traceabilityMarker?: { day: number; time: string; dayLabel: string }
): Table {
  const totalCols = isCombined ? 6 : 5;

  const headerLabels = isCombined
    ? ['Heure', 'Chapitre IFS', 'Chapitre BRC', 'Description', 'Équipe', 'Personnes']
    : ['Heure', 'Chapitre IFS', 'Description', 'Équipe', 'Personnes'];

  const headerCells = headerLabels.map(h =>
    buildCell(h, { bold: true, size: 16, color: 'FFFFFF', shading: DOCX_COLORS.C_RED_HEADER })
  );

  let rows = day.activities.map(a => buildActivityRow(a, isCombined, totalCols));

  if (traceabilityMarker && traceabilityMarker.day === day.day) {
    const launchMin = timeToMinutes(traceabilityMarker.time);
    const availMin = launchMin + 240;
    const availTime = minutesToTime(availMin);

    const markerAct: Activity = {
      id: 'trace-marker',
      time: availTime,
      chapterIFS: '',
      description: `Mise à disposition documents traçabilité (lancement ${traceabilityMarker.time})`,
      duration: 0,
      isOnSite: false,
      isFixed: true,
      isTraceability: true,
      day: day.day,
    };

    const insertIdx = rows.length - 1;
    const markerRow = buildActivityRow(markerAct, isCombined, totalCols);
    rows.splice(insertIdx, 0, markerRow);
  }

  return new Table({
    rows: [
      new TableRow({ tableHeader: true, children: headerCells }),
      ...rows,
    ],
  });
}

export async function generateAuditPlanDocx(plan: AuditPlan): Promise<Blob> {
  const isCombined = plan.referentialType === 'IFS+BRC';

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(0.8),
              bottom: convertInchesToTwip(0.8),
              left: convertInchesToTwip(0.8),
              right: convertInchesToTwip(0.8),
            },
          },
        },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'PLAN D\'AUDIT',
                bold: true,
                size: 28,
                color: DOCX_COLORS.C_RED_HEADER,
                font: 'Calibri',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `F-IFS-08 - ${plan.mandate.referential}`,
                size: 20,
                color: DOCX_COLORS.C_BLACK,
                font: 'Calibri',
              }),
            ],
          }),
          new Paragraph({ spacing: { after: 200 } }),
          buildHeaderInfoTable(plan),
          new Paragraph({ spacing: { after: 200 } }),
          ...plan.days.flatMap(day => [
            new Paragraph({
              spacing: { before: 200 },
              children: [
                new TextRun({
                  text: `Jour ${day.day} - ${day.label}`,
                  bold: true,
                  size: 22,
                  color: DOCX_COLORS.C_RED_HEADER,
                  font: 'Calibri',
                }),
              ],
            }),
            buildDayTable(day, isCombined, plan.traceabilityMarker),
            new Paragraph({ spacing: { after: 200 } }),
          ]),
        ],
      },
    ],
  });

  return await Packer.toBlob(doc);
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function downloadPlanDocx(plan: AuditPlan): Promise<void> {
  const blob = await generateAuditPlanDocx(plan);
  const filename = `Plan_Audit_${plan.mandate.companyName.replace(/[^a-zA-Z0-9]/g, '_')}.docx`;
  downloadBlob(blob, filename);
}
