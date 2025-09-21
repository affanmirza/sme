'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Copy, MessageCircle } from 'lucide-react';
import { getBadgeLabel, getBadgeClass } from '@/lib/decision-engine';

interface LeadDetail {
  id: string;
  createdAt: string;
  status: 'RED' | 'YELLOW' | 'GREEN';
  sektor: string;
  omzetBracket: string;
  yearsOperating: string;
  relationMandiri: string;
  productNeed: string;
  tenor?: string;
  legal_akta: boolean;
  aktaLastChangeYear?: number;
  legal_nib: boolean;
  legal_npwp: boolean;
  keyPersonClear: boolean;
  creditSelfDeclareOk: string;
  collateralType: string;
  ownership?: string;
  locationInArea?: string;
  valueChainEvidence: boolean;
  purposeNote?: string;
  reasons: string[];
  checklist: string[];
  createdBy: {
    email: string;
  };
}

export default function LeadDetailPage() {
  const params = useParams();
  const [lead, setLead] = useState<LeadDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchLead(params.id as string);
    }
  }, [params.id]);

  const fetchLead = async (id: string) => {
    try {
      const response = await fetch(`/api/leads/${id}`);
      if (response.ok) {
        const data = await response.json();
        setLead(data);
      }
    } catch (error) {
      console.error('Error fetching lead:', error);
    } finally {
      setIsLoading(false);
    }
  };


  const copyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    // You could add a toast notification here
  };

  const generateWhatsAppMessage = () => {
    if (!lead) return '';
    const badgeText = getBadgeLabel(lead.status);
    const message = `Halo, saya ingin menyerahkan lead SME dengan status: ${badgeText}\n\nLink detail: ${window.location.href}`;
    return encodeURIComponent(message);
  };

  const openWhatsApp = () => {
    if (lead) {
      const message = generateWhatsAppMessage();
      window.open(`https://wa.me/?text=${message}`, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <p>Memuat detail lead...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <p className="text-red-500">Lead tidak ditemukan</p>
          </div>
        </div>
      </div>
    );
  }

  const reasons = lead.reasons || [];
  const checklist = lead.checklist || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Detail Lead</h1>
              <p className="text-sm sm:text-base text-gray-600">
                Dibuat pada {new Date(lead.createdAt).toLocaleDateString()}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:flex-shrink-0">
              <Button onClick={copyLink} variant="outline" size="sm" className="flex items-center justify-center gap-2 w-full sm:w-auto">
                <Copy className="h-4 w-4" />
                Copy Link
              </Button>
              <Button onClick={openWhatsApp} variant="outline" size="sm" className="flex items-center justify-center gap-2 w-full sm:w-auto">
                <MessageCircle className="h-4 w-4" />
                WhatsApp RM
              </Button>
            </div>
          </div>
        </div>

        {/* Status Card */}
        <Card className="p-6 mb-6">
          <div className="text-center">
            <Badge className={`text-lg px-4 py-2 mb-4 ${getBadgeClass(lead.status)}`}>
              {getBadgeLabel(lead.status)}
            </Badge>
            
            {reasons.length > 0 && (
              <div className="text-left">
                <h3 className="font-semibold text-gray-900 mb-3">Alasan:</h3>
                <ul className="space-y-2">
                  {reasons.map((reason, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span className="text-gray-700">{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Card>

        {/* Checklist */}
        {checklist.length > 0 && (
          <Card className="p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Checklist Dokumen/Informasi:</h3>
            <ul className="space-y-2">
              {checklist.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Form Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Info */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Informasi Dasar</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Sektor:</span>
                <p className="text-gray-900">{lead.sektor}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Omzet Tahunan:</span>
                <p className="text-gray-900">{lead.omzetBracket}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Usia Perusahaan:</span>
                <p className="text-gray-900">{lead.yearsOperating}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Hubungan Mandiri:</span>
                <p className="text-gray-900">{lead.relationMandiri}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Produk:</span>
                <p className="text-gray-900">{lead.productNeed}</p>
              </div>
              {lead.tenor && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Tenor:</span>
                  <p className="text-gray-900">{lead.tenor}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Legal Info */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Dokumen Legal</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Akta Pendirian/Perubahan:</span>
                <p className="text-gray-900">{lead.legal_akta ? 'Ya' : 'Tidak'}</p>
              </div>
              {lead.aktaLastChangeYear && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Tahun Perubahan Akta:</span>
                  <p className="text-gray-900">{lead.aktaLastChangeYear}</p>
                </div>
              )}
              <div>
                <span className="text-sm font-medium text-gray-500">NIB (OSS):</span>
                <p className="text-gray-900">{lead.legal_nib ? 'Ya' : 'Tidak'}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">NPWP Badan:</span>
                <p className="text-gray-900">{lead.legal_npwp ? 'Ya' : 'Tidak'}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Key Person Jelas:</span>
                <p className="text-gray-900">{lead.keyPersonClear ? 'Ya' : 'Tidak'}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Status Kredit:</span>
                <p className="text-gray-900">{lead.creditSelfDeclareOk}</p>
              </div>
            </div>
          </Card>

          {/* Collateral Info */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Informasi Agunan</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Jenis Agunan:</span>
                <p className="text-gray-900">{lead.collateralType}</p>
              </div>
              {lead.ownership && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Kepemilikan:</span>
                  <p className="text-gray-900">{lead.ownership}</p>
                </div>
              )}
              {lead.locationInArea && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Lokasi di Area:</span>
                  <p className="text-gray-900">{lead.locationInArea}</p>
                </div>
              )}
              <div>
                <span className="text-sm font-medium text-gray-500">Bukti Value Chain:</span>
                <p className="text-gray-900">{lead.valueChainEvidence ? 'Ya' : 'Tidak'}</p>
              </div>
            </div>
          </Card>

          {/* Staff Info */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Informasi Staff</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Staff:</span>
                <p className="text-gray-900">{lead.createdBy.email}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Purpose Note */}
        {lead.purposeNote && (
          <Card className="p-6 mt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Catatan Tujuan Penggunaan</h3>
            <p className="text-gray-700">{lead.purposeNote}</p>
          </Card>
        )}
      </div>
    </div>
  );
}
