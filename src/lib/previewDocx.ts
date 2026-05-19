import * as mammoth from 'mammoth';

export async function docxToHtml(blob: Blob): Promise<string> {
  try {
    const arrayBuffer = await blob.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    return result.value;
  } catch (err) {
    console.error('Mammoth conversion error:', err);
    return '<p style="color: #b6452c;">Erreur lors de la génération de la prévisualisation HTML.</p>';
  }
}

export async function generatePreviewHtml(
  generateBlob: () => Promise<Blob>,
  onProgress?: (msg: string) => void
): Promise<string> {
  onProgress?.('Génération du document...');
  const blob = await generateBlob();
  onProgress?.('Conversion en HTML...');
  const html = await docxToHtml(blob);
  return html;
}
