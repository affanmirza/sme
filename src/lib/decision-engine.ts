import { LeadFormData, INDUSTRY_TO_CATEGORY } from './validations';

export interface ScoreResult {
  badge: 'RED' | 'YELLOW' | 'GREEN';
  reasons: string[];
  checklist: string[];
}

export function scoreLead(form: LeadFormData): ScoreResult {
  const reasons: string[] = [];
  const checklist: string[] = [];
  const sektorCategory = INDUSTRY_TO_CATEGORY[form.sektor as keyof typeof INDUSTRY_TO_CATEGORY];

  // RED conditions
  if (form.yearsOperating === '<1' || form.yearsOperating === '1-<3') {
    reasons.push('Usia perusahaan kurang dari 3 tahun');
  }

  if (!form.legal_akta || !form.legal_nib || !form.legal_npwp) {
    reasons.push('Dokumen legal tidak lengkap');
  }

  if (sektorCategory === 'Waspada') {
    reasons.push('Sektor waspada');
  }

  if (form.productNeed === 'KI' && form.collateralType === 'BelumSiap') {
    reasons.push('Kredit Investasi memerlukan agunan yang siap');
  }

  if (form.creditSelfDeclareOk === 'Tidak') {
    reasons.push('Debitur menyatakan tidak bersih dari kredit bermasalah');
  }

  // If any RED condition is met, return RED
  if (reasons.length > 0) {
    buildChecklist(form, checklist);
    return { badge: 'RED', reasons, checklist };
  }

  // YELLOW conditions
  if (sektorCategory === 'Selektif') {
    reasons.push('Industri selektif. Eskalasi AH/SMEH.');
  }

  if (form.relationMandiri !== 'Rekening>=6bln') {
    reasons.push('Belum memiliki rekening Mandiri aktif minimal 6 bulan');
  }

  if (form.collateralType !== 'BelumSiap' && form.ownership !== 'Debitur') {
    reasons.push('Agunan bukan milik debitur');
  }

  if (!form.valueChainEvidence && ['KMK', 'IF', 'DF'].includes(form.productNeed)) {
    reasons.push('Belum ada bukti value chain untuk produk yang diminta');
  }

  if (form.creditSelfDeclareOk === 'TidakTahu') {
    reasons.push('Debitur tidak mengetahui status kredit bermasalah');
  }

  if (form.aktaLastChangeYear && form.aktaLastChangeYear < new Date().getFullYear() - 2) {
    reasons.push('Akta terakhir diubah lebih dari 2 tahun lalu');
  }

  // If any YELLOW condition is met, return YELLOW
  if (reasons.length > 0) {
    buildChecklist(form, checklist);
    return { badge: 'YELLOW', reasons, checklist };
  }

  // GREEN - all conditions passed
  buildChecklist(form, checklist);
  return { badge: 'GREEN', reasons: [], checklist };
}

function buildChecklist(form: LeadFormData, checklist: string[]): void {
  const sektorCategory = INDUSTRY_TO_CATEGORY[form.sektor as keyof typeof INDUSTRY_TO_CATEGORY];
  if (!form.legal_akta) {
    checklist.push('Akta pendirian/perubahan');
  }

  if (!form.legal_nib) {
    checklist.push('NIB (OSS)');
  }

  if (!form.legal_npwp) {
    checklist.push('NPWP Badan');
  }

  if (form.relationMandiri !== 'Rekening>=6bln') {
    checklist.push('Buka/aktifkan rekening Mandiri dan tunjukkan arus kas 3–6 bulan');
  }

  if (sektorCategory === 'Selektif') {
    checklist.push('Konfirmasi sektor ke AH/SMEH');
  }

  if (form.productNeed === 'KI' && form.collateralType !== 'BelumSiap' && form.ownership !== 'Debitur') {
    checklist.push('Rencana pengikatan & persetujuan pemilik agunan');
  }

  if (!form.valueChainEvidence && ['KMK', 'IF', 'DF'].includes(form.productNeed)) {
    checklist.push('Lampirkan kontrak/PO/rekomendasi Principal');
  }

  if (form.locationInArea && form.locationInArea !== 'Ya') {
    checklist.push('Pastikan lokasi agunan di area layanan & bukan HPL');
  }
}

export function getBadgeLabel(badge: 'RED' | 'YELLOW' | 'GREEN'): string {
  switch (badge) {
    case 'RED':
      return 'Tidak Lolos Screen';
    case 'YELLOW':
      return 'Perlu Konfirmasi Lanjut';
    case 'GREEN':
      return 'Siap Di-PAS';
  }
}

export function getBadgeClass(badge: 'RED' | 'YELLOW' | 'GREEN'): string {
  switch (badge) {
    case 'GREEN':
      return 'border-transparent bg-green-600 text-white hover:bg-green-700';
    case 'YELLOW':
      return 'border-transparent bg-yellow-500 text-black hover:bg-yellow-600';
    case 'RED':
      return 'border-transparent bg-red-600 text-white hover:bg-red-700';
  }
}
