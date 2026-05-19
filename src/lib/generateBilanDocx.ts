import { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, WidthType, AlignmentType, ShadingType, convertInchesToTwip } from 'docx';
import { AuditPlan } from './types';
import { DOCX_COLORS } from './constants';

function buildField(label: string, value: string): TableRow {
  return new TableRow({
    children: [
      new TableCell({
        width: { size: 3500, type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, fill: DOCX_COLORS.C_GREY_LABEL },
        children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 18, font: 'Calibri' })] })],
      }),
      new TableCell({
        width: { size: 4500, type: WidthType.DXA },
        children: [new Paragraph({ children: [new TextRun({ text: value, size: 18, font: 'Calibri' })] })],
      }),
    ],
  });
}

export async function generateBilanDocx(plan: AuditPlan): Promise<Blob> {
  const { mandate } = plan;

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
              new TextRun({ text: 'BILAN DE CLÔTURE', bold: true, size: 28, color: DOCX_COLORS.C_RED_HEADER, font: 'Calibri' }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({ text: 'F-IFS-15', size: 20, color: DOCX_COLORS.C_BLACK, font: 'Calibri' }),
            ],
          }),
          new Table({
            rows: [
              buildField('Raison Sociale', mandate.companyName),
              buildField('Adresse', mandate.address),
              buildField('COID', mandate.coid),
              buildField('Contact', mandate.contactName),
              buildField('Email', mandate.contactMail),
              buildField("Type d'audit", mandate.auditType),
              buildField('Référentiel', mandate.referential),
              buildField('Périmètre', mandate.scope),
              buildField('Exclusions', mandate.exclusion || 'Aucune'),
              buildField('Exemples de produits', mandate.productExamples),
              buildField('Secteurs technologiques', mandate.technologySectors),
              buildField('Durée', `${plan.durationDays} jours`),
              buildField('Dates', mandate.dates),
              buildField('Auditeur principal', mandate.leadAuditor),
              buildField('Organisme d\'audit', mandate.auditOrganization),
            ],
          }),
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

export async function downloadBilanDocx(plan: AuditPlan): Promise<void> {
  const blob = await generateBilanDocx(plan);
  const filename = `Bilan_Cloture_${plan.mandate.companyName.replace(/[^a-zA-Z0-9]/g, '_')}.docx`;
  downloadBlob(blob, filename);
}
