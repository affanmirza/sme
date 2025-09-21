'use client';

import { useState } from 'react';
import { WizardShell } from './WizardShell';
import { StepWrapper, RadioStep, YesNoStep, NumberStep, TextStep } from './StepComponents';
import { ResultCard } from './ResultCard';
import { LeadFormData, INDUSTRY_OPTIONS, INDUSTRY_TO_CATEGORY } from '@/lib/validations';
import { scoreLead } from '@/lib/decision-engine';

const TOTAL_STEPS = 16;

const SECTOR_OPTIONS = INDUSTRY_OPTIONS.map((i) => ({ value: i, label: i }));

const OMZET_OPTIONS = [
  { value: '<500jt', label: '< 500 juta' },
  { value: '500jt-2M', label: '500 juta - 2 M' },
  { value: '2-10M', label: '2 - 10 M' },
  { value: '10-50M', label: '10 - 50 M' },
  { value: '>50M', label: '> 50 M' },
];

const YEARS_OPTIONS = [
  { value: '<1', label: '< 1 tahun' },
  { value: '1-<3', label: '1 - < 3 tahun' },
  { value: '>=3', label: '≥ 3 tahun' },
];

const RELATION_OPTIONS = [
  { value: 'Rekening>=6bln', label: 'Rekening ≥ 6 bulan' },
  { value: 'Rekening<6bln', label: 'Rekening < 6 bulan' },
  { value: 'BelumPunya', label: 'Belum punya rekening' },
];

const PRODUCT_OPTIONS = [
  { value: 'KMK', label: 'KMK (Kredit Modal Kerja)' },
  { value: 'KI', label: 'KI (Kredit Investasi)' },
  { value: 'IF', label: 'IF (Invoice Financing)' },
  { value: 'DF', label: 'DF (Distributor Financing)' },
  { value: 'TopUp', label: 'Top Up' },
];

const TENOR_OPTIONS = [
  { value: '<=12bln', label: '≤ 12 bulan' },
  { value: '2-3th', label: '2 - 3 tahun' },
  { value: '>3th', label: '> 3 tahun' },
];

const CREDIT_OPTIONS = [
  { value: 'Ya', label: 'Ya' },
  { value: 'Tidak', label: 'Tidak' },
  { value: 'TidakTahu', label: 'Tidak tahu' },
];

const COLLATERAL_OPTIONS = [
  { value: 'SHM/SHGB', label: 'SHM/SHGB' },
  { value: 'Ruko', label: 'Ruko' },
  { value: 'TanahKosong', label: 'Tanah Kosong' },
  { value: 'BPKB', label: 'BPKB' },
  { value: 'Persediaan/Invoice', label: 'Persediaan/Invoice' },
  { value: 'Lainnya', label: 'Lainnya' },
  { value: 'BelumSiap', label: 'Belum siap' },
];

const OWNERSHIP_OPTIONS = [
  { value: 'Debitur', label: 'Debitur' },
  { value: 'Pasangan/Ortu', label: 'Pasangan/Orang Tua' },
  { value: 'PihakLain', label: 'Pihak Lain' },
];

const LOCATION_OPTIONS = [
  { value: 'Ya', label: 'Ya' },
  { value: 'Tidak', label: 'Tidak' },
  { value: 'TidakPasti', label: 'Tidak pasti' },
];

export function FormWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<LeadFormData>>({});
  const [result, setResult] = useState<ReturnType<typeof scoreLead> | null>(null);
  const [stepStatuses, setStepStatuses] = useState<Array<'GREEN'|'YELLOW'|'RED'>>(Array(TOTAL_STEPS).fill('GREEN'));

  const updateFormData = (field: keyof LeadFormData, value: unknown) => {
    setFormData(prev => {
      const next = { ...prev, [field]: value } as Partial<LeadFormData>;
      computeStepStatus(field as keyof LeadFormData, next);
      return next;
    });
  };

  const setStatusAt = (index: number, status: 'GREEN'|'YELLOW'|'RED') => {
    setStepStatuses((prev) => {
      const copy = [...prev];
      copy[index - 1] = status;
      return copy;
    });
  };

  const computeStepStatus = (field: keyof LeadFormData, data: Partial<LeadFormData>) => {
    // Default GREEN
    let status: 'GREEN'|'YELLOW'|'RED' = 'GREEN';
    switch (field) {
      case 'sektor': {
        const cat = data.sektor ? INDUSTRY_TO_CATEGORY[data.sektor as keyof typeof INDUSTRY_TO_CATEGORY] : undefined;
        if (cat === 'Waspada') status = 'RED';
        else if (cat === 'Selektif') status = 'YELLOW';
        break;
      }
      case 'yearsOperating': {
        if (data.yearsOperating === '<1' || data.yearsOperating === '1-<3') status = 'RED';
        break;
      }
      case 'legal_akta':
      case 'legal_nib':
      case 'legal_npwp': {
        if (data.legal_akta === false || data.legal_nib === false || data.legal_npwp === false) status = 'RED';
        break;
      }
      case 'productNeed':
      case 'collateralType': {
        if (data.productNeed === 'KI' && data.collateralType === 'BelumSiap') status = 'RED';
        break;
      }
      case 'creditSelfDeclareOk': {
        if (data.creditSelfDeclareOk === 'Tidak') status = 'RED';
        else if (data.creditSelfDeclareOk === 'TidakTahu') status = 'YELLOW';
        break;
      }
      case 'relationMandiri': {
        if (data.relationMandiri && data.relationMandiri !== 'Rekening>=6bln') status = 'YELLOW';
        break;
      }
      case 'ownership':
      case 'locationInArea': {
        if (data.collateralType !== 'BelumSiap' && data.ownership && data.ownership !== 'Debitur') status = 'YELLOW';
        break;
      }
      case 'valueChainEvidence': {
        if (data.valueChainEvidence === false && data.productNeed && ['KMK','IF','DF'].includes(data.productNeed)) status = 'YELLOW';
        break;
      }
      case 'aktaLastChangeYear': {
        if (data.aktaLastChangeYear && data.aktaLastChangeYear < new Date().getFullYear() - 2) status = 'YELLOW';
        break;
      }
    }
    // map field to step index
    const fieldToStep: Partial<Record<keyof LeadFormData, number>> = {
      sektor: 1,
      omzetBracket: 2,
      yearsOperating: 3,
      relationMandiri: 4,
      productNeed: 5,
      tenor: 6,
      legal_akta: 7,
      aktaLastChangeYear: 8,
      legal_nib: 9,
      legal_npwp: 10,
      keyPersonClear: 11,
      creditSelfDeclareOk: 12,
      collateralType: 13,
      ownership: 14,
      locationInArea: 14,
      valueChainEvidence: 15,
      purposeNote: 16,
    };
    const stepIndex = fieldToStep[field];
    if (stepIndex) setStatusAt(stepIndex, status);
  };

  const canGoNext = () => {
    switch (currentStep) {
      case 1: return !!formData.sektor;
      case 2: return !!formData.omzetBracket;
      case 3: return !!formData.yearsOperating;
      case 4: return !!formData.relationMandiri;
      case 5: return !!formData.productNeed;
      case 6: return formData.productNeed && ['KI', 'KMK'].includes(formData.productNeed) ? !!formData.tenor : true;
      case 7: return formData.legal_akta !== undefined;
      case 8: return formData.legal_akta === true ? formData.aktaLastChangeYear !== undefined : true;
      case 9: return formData.legal_nib !== undefined;
      case 10: return formData.legal_npwp !== undefined;
      case 11: return formData.keyPersonClear !== undefined;
      case 12: return !!formData.creditSelfDeclareOk;
      case 13: return !!formData.collateralType;
      case 14: return formData.collateralType && formData.collateralType !== 'BelumSiap' ? 
        !!formData.ownership && !!formData.locationInArea : true;
      case 15: return formData.valueChainEvidence !== undefined;
      case 16: return true; // purposeNote is optional
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const score = scoreLead(formData as LeadFormData);
      setResult(score);
    } catch (error) {
      console.error('Error scoring lead:', error);
    }
  };

  const handleSaveLead = async () => {
    // else?
    if (!result) return;
    
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          status: result.badge,
          reasons: JSON.stringify(result.reasons),
          checklist: JSON.stringify(result.checklist),
        }),
      });

      if (response.ok) {
        const savedLead = await response.json();
        // You could show a success message here
      }
    } catch (error) {
      console.error('Error saving lead:', error);
    }
  };

  const handleSendToRM = async () => {
    // Implementation for sending to RM
  };

  if (result) {
    return (
      <WizardShell currentStep={TOTAL_STEPS} totalSteps={TOTAL_STEPS}>
        <ResultCard
          badge={result.badge}
          reasons={result.reasons}
          checklist={result.checklist}
          onSaveLead={handleSaveLead}
          onSendToRM={handleSendToRM}
          canSendToRM={result.badge === 'GREEN' || result.badge === 'YELLOW'}
          leadId=''
        />
      </WizardShell>
    );
  }

  return (
    <WizardShell currentStep={currentStep} totalSteps={TOTAL_STEPS}>
      <StepWrapper
        title={`Langkah ${currentStep}`}
        onNext={handleNext}
        onPrev={handlePrev}
        canGoNext={canGoNext()}
        canGoPrev={currentStep > 1}
        status={stepStatuses[currentStep - 1]}
      >
        {currentStep === 1 && (
          <>
            <h3 className="text-lg font-medium mb-4">Sektor Usaha</h3>
            <RadioStep
              value={formData.sektor || ''}
              onChange={(value) => updateFormData('sektor', value)}
              options={SECTOR_OPTIONS}
            />
          </>
        )}

        {currentStep === 2 && (
          <>
            <h3 className="text-lg font-medium mb-4">Omzet Tahunan</h3>
            <RadioStep
              value={formData.omzetBracket || ''}
              onChange={(value) => updateFormData('omzetBracket', value)}
              options={OMZET_OPTIONS}
            />
          </>
        )}

        {currentStep === 3 && (
          <>
            <h3 className="text-lg font-medium mb-4">Usia Perusahaan</h3>
            <RadioStep
              value={formData.yearsOperating || ''}
              onChange={(value) => updateFormData('yearsOperating', value)}
              options={YEARS_OPTIONS}
            />
          </>
        )}

        {currentStep === 4 && (
          <>
            <h3 className="text-lg font-medium mb-4">Hubungan dengan Bank Mandiri</h3>
            <RadioStep
              value={formData.relationMandiri || ''}
              onChange={(value) => updateFormData('relationMandiri', value)}
              options={RELATION_OPTIONS}
            />
          </>
        )}

        {currentStep === 5 && (
          <>
            <h3 className="text-lg font-medium mb-4">Kebutuhan Produk</h3>
            <RadioStep
              value={formData.productNeed || ''}
              onChange={(value) => updateFormData('productNeed', value)}
              options={PRODUCT_OPTIONS}
            />
          </>
        )}

        {currentStep === 6 && formData.productNeed && ['KI', 'KMK'].includes(formData.productNeed) && (
          <>
            <h3 className="text-lg font-medium mb-4">Tenor yang Diinginkan</h3>
            <RadioStep
              value={formData.tenor || ''}
              onChange={(value) => updateFormData('tenor', value)}
              options={TENOR_OPTIONS}
            />
          </>
        )}

        {currentStep === 7 && (
          <>
            <h3 className="text-lg font-medium mb-4">Apakah memiliki Akta Pendirian/Perubahan?</h3>
            <YesNoStep
              value={formData.legal_akta ?? null}
              onChange={(value) => updateFormData('legal_akta', value)}
            />
          </>
        )}

        {currentStep === 8 && (
          <>
            <h3 className="text-lg font-medium mb-4">Tahun Terakhir Perubahan Akta</h3>
            {formData.legal_akta === true ? (
              <NumberStep
                value={formData.aktaLastChangeYear}
                onChange={(value) => updateFormData('aktaLastChangeYear', value)}
                placeholder="Contoh: 2023"
                min={1990}
                max={new Date().getFullYear()}
              />
            ) : (
              <div className="text-gray-500 text-sm">Tidak ada perubahan akta. Lanjutkan ke langkah berikutnya.</div>
            )}
          </>
        )}

        {currentStep === 9 && (
          <>
            <h3 className="text-lg font-medium mb-4">Apakah memiliki NIB (OSS)?</h3>
            <YesNoStep
              value={formData.legal_nib ?? null}
              onChange={(value) => updateFormData('legal_nib', value)}
            />
          </>
        )}

        {currentStep === 10 && (
          <>
            <h3 className="text-lg font-medium mb-4">Apakah memiliki NPWP Badan?</h3>
            <YesNoStep
              value={formData.legal_npwp ?? null}
              onChange={(value) => updateFormData('legal_npwp', value)}
            />
          </>
        )}

        {currentStep === 11 && (
          <>
            <h3 className="text-lg font-medium mb-4">Apakah key person sudah jelas?</h3>
            <YesNoStep
              value={formData.keyPersonClear ?? null}
              onChange={(value) => updateFormData('keyPersonClear', value)}
            />
          </>
        )}

        {currentStep === 12 && (
          <>
            <h3 className="text-lg font-medium mb-4">Apakah debitur bersih dari kredit bermasalah?</h3>
            <RadioStep
              value={formData.creditSelfDeclareOk || ''}
              onChange={(value) => updateFormData('creditSelfDeclareOk', value)}
              options={CREDIT_OPTIONS}
            />
          </>
        )}

        {currentStep === 13 && (
          <>
            <h3 className="text-lg font-medium mb-4">Jenis Agunan</h3>
            <RadioStep
              value={formData.collateralType || ''}
              onChange={(value) => updateFormData('collateralType', value)}
              options={COLLATERAL_OPTIONS}
            />
          </>
        )}

        {currentStep === 14 && formData.collateralType && formData.collateralType !== 'BelumSiap' && (
          <>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Kepemilikan Agunan</h3>
                <RadioStep
                  value={formData.ownership || ''}
                  onChange={(value) => updateFormData('ownership', value)}
                  options={OWNERSHIP_OPTIONS}
                />
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Lokasi Agunan di Area Layanan?</h3>
                <RadioStep
                  value={formData.locationInArea || ''}
                  onChange={(value) => updateFormData('locationInArea', value)}
                  options={LOCATION_OPTIONS}
                />
              </div>
            </div>
          </>
        )}

        {currentStep === 15 && (
          <>
            <h3 className="text-lg font-medium mb-4">Apakah ada bukti value chain (kontrak/PO/rekomendasi principal)?</h3>
            <YesNoStep
              value={formData.valueChainEvidence ?? null}
              onChange={(value) => updateFormData('valueChainEvidence', value)}
            />
          </>
        )}

        {currentStep === 16 && (
          <>
            <h3 className="text-lg font-medium mb-4">Catatan Tujuan Penggunaan (Opsional)</h3>
            <TextStep
              value={formData.purposeNote || ''}
              onChange={(value) => updateFormData('purposeNote', value)}
              placeholder="Jelaskan tujuan penggunaan dana..."
              maxLength={500}
            />
          </>
        )}

      </StepWrapper>
    </WizardShell>
  );
}
