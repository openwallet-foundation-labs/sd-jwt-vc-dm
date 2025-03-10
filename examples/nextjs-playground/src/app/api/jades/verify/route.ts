import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { credential } = await request.json();

    if (!credential) {
      return NextResponse.json(
        { verified: false, error: 'Credential is required' },
        { status: 400 },
      );
    }

    return NextResponse.json({ verified: Math.random() > 0.2 });
  } catch (error) {
    console.error('Error creating presentation:', error);
    return NextResponse.json(
      {
        verified: false,
        error: (error as Error).message || 'Failed to create presentation',
      },
      { status: 500 },
    );
  }
}
