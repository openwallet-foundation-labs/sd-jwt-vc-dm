import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Extract data from the request
    const { credential, presentFrame } = await request.json();
    console.log(presentFrame);
    console.log(credential);

    if (!credential || !presentFrame) {
      return NextResponse.json(
        { error: 'Credential is required' },
        { status: 400 },
      );
    }

    return NextResponse.json({ credential });
  } catch (error) {
    console.error('Error creating presentation:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to create presentation' },
      { status: 500 },
    );
  }
}
