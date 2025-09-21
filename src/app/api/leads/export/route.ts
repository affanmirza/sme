import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {

    const leads = await prisma.lead.findMany({
      include: {
        createdBy: {
          select: { email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Create CSV content
    const headers = [
      'Tanggal',
      'Status',
      'Sektor',
      'Omzet Bracket',
      'Usia Perusahaan',
      'Hubungan Mandiri',
      'Produk',
      'Tenor',
      'Legal Akta',
      'Tahun Perubahan Akta',
      'Legal NIB',
      'Legal NPWP',
      'Key Person Clear',
      'Status Kredit',
      'Jenis Agunan',
      'Kepemilikan Agunan',
      'Lokasi di Area',
      'Bukti Value Chain',
      'Catatan Tujuan',
      'Staff',
      'Alasan',
      'Checklist'
    ];

    const csvRows = [headers.join(',')];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    leads.forEach((lead: any) => {
      const row = [
        new Date(lead.createdAt).toLocaleDateString(),
        lead.status,
        lead.sektor,
        lead.omzetBracket,
        lead.yearsOperating,
        lead.relationMandiri,
        lead.productNeed,
        lead.tenor || '',
        lead.legal_akta ? 'Ya' : 'Tidak',
        lead.aktaLastChangeYear || '',
        lead.legal_nib ? 'Ya' : 'Tidak',
        lead.legal_npwp ? 'Ya' : 'Tidak',
        lead.keyPersonClear ? 'Ya' : 'Tidak',
        lead.creditSelfDeclareOk,
        lead.collateralType,
        lead.ownership || '',
        lead.locationInArea || '',
        lead.valueChainEvidence ? 'Ya' : 'Tidak',
        lead.purposeNote || '',
        lead.createdBy.email,
        JSON.parse(lead.reasons || '[]').join('; '),
        JSON.parse(lead.checklist || '[]').join('; ')
      ].map(field => `"${String(field).replace(/"/g, '""')}"`);

      csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="leads-${new Date().toISOString().split('T')[0]}.csv"`
      }
    });
  } catch (error) {
    console.error('Export leads error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
