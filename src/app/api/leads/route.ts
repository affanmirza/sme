import { NextRequest, NextResponse } from 'next/server';
import { leadFormSchema, INDUSTRY_TO_CATEGORY } from '@/lib/validations';
import { scoreLead } from '@/lib/decision-engine';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Use a default user ID for now
    const defaultUserId = 'cmfucxiyi0004zagyqa32ddkp'; // This is the admin user ID from production

    const body = await request.json();
    const validatedData = leadFormSchema.parse(body);

    // Score the lead
    const score = scoreLead(validatedData);

    // Save to database
    const lead = await prisma.lead.create({
      data: {
        ...validatedData,
        sektorCategory: INDUSTRY_TO_CATEGORY[validatedData.sektor as keyof typeof INDUSTRY_TO_CATEGORY],
        createdById: defaultUserId,
        status: score.badge,
        reasons: JSON.stringify(score.reasons),
        checklist: JSON.stringify(score.checklist),
      },
      include: {
        createdBy: {
          select: { email: true }
        }
      }
    });

    return NextResponse.json({
      ...lead,
      reasons: score.reasons,
      checklist: score.checklist
    });
  } catch (error: unknown) {
    console.error('Create lead error:', error);
    
    if (error && typeof error === 'object' && 'errors' in error) {
      return NextResponse.json(
        { message: 'Data tidak valid', errors: (error as { errors: unknown }).errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where = status && status !== 'all' ? { status } : {};

    const leads = await prisma.lead.findMany({
      where,
      include: {
        createdBy: {
          select: { email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(leads);
  } catch (error) {
    console.error('Get leads error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
