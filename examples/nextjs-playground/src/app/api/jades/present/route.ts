import { NextRequest, NextResponse } from 'next/server';
import { JAdES } from 'sd-jwt-jades';

export async function POST(request: NextRequest) {
  try {
    // Extract data from the request
    const { credential, presentFrame } = await request.json();

    // Validate request parameters
    if (!credential) {
      return NextResponse.json(
        { error: 'Credential is required' },
        { status: 400 },
      );
    }

    // If presentFrame is an empty object {}, treat it as undefined
    let normalizedPresentFrame = presentFrame;
    if (presentFrame && Object.keys(presentFrame).length === 0) {
      console.log('Empty presentation frame detected, treating as undefined');
      normalizedPresentFrame = undefined;
    }

    // Create a presentation according to the disclosure selection
    const presentation = await JAdES.Present.present(
      credential,
      normalizedPresentFrame,
    );

    return NextResponse.json({ presentation });
  } catch (error) {
    console.error('Error creating presentation:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to create presentation' },
      { status: 500 },
    );
  }
}
