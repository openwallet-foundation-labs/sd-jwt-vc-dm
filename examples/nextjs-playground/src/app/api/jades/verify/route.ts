import { NextRequest, NextResponse } from 'next/server';
import { JAdES } from 'sd-jwt-jades';

export async function POST(request: NextRequest) {
  try {
    const { credential } = await request.json();

    if (!credential) {
      return NextResponse.json(
        { verified: false, error: 'Credential is required' },
        { status: 400 },
      );
    }

    // If verification fails (e.g., invalid signature, tampered data),
    // JAdES.Verify.verify() throws an exception, which will be handled in the following catch block.
    const result = await JAdES.Verify.verify(credential);

    return NextResponse.json({
      verified: true,
      credential: {
        payload: result.payload,
        headers: result.headers,
        ...(result.kb && { keyBinding: result.kb }),
      },
    });
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
