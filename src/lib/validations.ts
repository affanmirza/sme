import { z } from 'zod';

export const INDUSTRY_OPTIONS = [
  'Industri/Manufaktur',
  'Perdagangan',
  'Jasa Non-Perdagangan',
  'Kehutanan',
  'Konsumsi',
  'Oil & Gas',
  'Perikanan & Peternakan',
  'Pertambangan',
] as const;

export type Industry = typeof INDUSTRY_OPTIONS[number];

export const INDUSTRY_TO_CATEGORY: Record<Industry, 'Menarik' | 'Netral' | 'Selektif' | 'Waspada'> = {
  'Industri/Manufaktur': 'Menarik',
  'Perdagangan': 'Netral',
  'Jasa Non-Perdagangan': 'Netral',
  'Kehutanan': 'Selektif',
  'Konsumsi': 'Menarik',
  'Oil & Gas': 'Selektif',
  'Perikanan & Peternakan': 'Netral',
  'Pertambangan': 'Waspada',
};

export const leadFormSchema = z.object({
  sektor: z.enum(INDUSTRY_OPTIONS),
  omzetBracket: z.enum(['<500jt', '500jt-2M', '2-10M', '10-50M', '>50M']),
  yearsOperating: z.enum(['<1', '1-<3', '>=3']),
  relationMandiri: z.enum(['Rekening>=6bln', 'Rekening<6bln', 'BelumPunya']),
  productNeed: z.enum(['KMK', 'KI', 'IF', 'DF', 'TopUp']),
  tenor: z.enum(['<=12bln', '2-3th', '>3th']).optional(),
  legal_akta: z.boolean(),
  aktaLastChangeYear: z.number().optional(),
  legal_nib: z.boolean(),
  legal_npwp: z.boolean(),
  keyPersonClear: z.boolean(),
  creditSelfDeclareOk: z.enum(['Ya', 'Tidak', 'TidakTahu']),
  collateralType: z.enum(['SHM/SHGB', 'Ruko', 'TanahKosong', 'BPKB', 'Persediaan/Invoice', 'Lainnya', 'BelumSiap']),
  ownership: z.enum(['Debitur', 'Pasangan/Ortu', 'PihakLain']).optional(),
  locationInArea: z.enum(['Ya', 'Tidak', 'TidakPasti']).optional(),
  valueChainEvidence: z.boolean(),
  purposeNote: z.string().optional(),
});

export type LeadFormData = z.infer<typeof leadFormSchema>;
