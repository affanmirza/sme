import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {

    const { id } = await params;
    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: { email: true }
        }
      }
    });

    if (!lead) {
      return NextResponse.json({ message: 'Lead tidak ditemukan' }, { status: 404 });
    }

    // Parse JSON fields
    const leadWithParsedData = {
      ...lead,
      reasons: JSON.parse(lead.reasons || '[]'),
      checklist: JSON.parse(lead.checklist || '[]')
    };

    return NextResponse.json(leadWithParsedData);
  } catch (error) {
    console.error('Get lead error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
