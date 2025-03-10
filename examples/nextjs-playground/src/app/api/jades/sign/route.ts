import { NextRequest, NextResponse } from 'next/server';
import { createPrivateKey } from 'crypto';
import { CERT_PEM, KEY_PEM } from '@/constants/certificates';
import { parseCerts, createKidFromCert } from 'sd-jwt-jades';
import { JAdES } from 'sd-jwt-jades';

export async function POST(request: NextRequest) {
  try {
    const { credential, profile, disclosureFrame } = await request.json();

    if (!credential) {
      return NextResponse.json(
        { error: 'Credential data is required' },
        { status: 400 },
      );
    }

    // Parse certificates
    const certs = parseCerts(CERT_PEM);
    const kid = createKidFromCert(certs[0]);
    const privateKey = createPrivateKey(KEY_PEM);

    // Create JAdES signature
    const jades = new JAdES.Sign(credential);

    // Set up base JAdES configuration
    jades
      .setProtectedHeader({
        alg: 'RS256',
        typ: 'jades',
      })
      .setX5c(certs)
      .setSignedAt();

    // Apply disclosure frame if provided
    if (disclosureFrame) {
      jades.setDisclosureFrame(disclosureFrame);
    }

    // Apply profile-specific configuration
    if (profile === 'B-T') {
      jades.setUnprotectedHeader({
        etsiU: [
          {
            sigTst: {
              tstTokens: [
                {
                  // For demo, using placeholder - in real implementation, would get actual timestamp
                  val: 'Base64-encoded-RFC-3161-Timestamp-Token-placeholder',
                },
              ],
            },
          },
        ],
      });
    } else if (profile === 'B-LT') {
      jades.setUnprotectedHeader({
        etsiU: [
          {
            sigTst: {
              tstTokens: [
                {
                  val: 'Base64-encoded-RFC-3161-Timestamp-Token-placeholder',
                },
              ],
            },
          },
          {
            xVals: [
              { x509Cert: 'Base64-encoded-Trust-Anchor-placeholder' },
              { x509Cert: 'Base64-encoded-CA-Certificate-placeholder' },
            ],
          },
          {
            rVals: {
              crlVals: ['Base64-encoded-CRL-placeholder'],
              ocspVals: ['Base64-encoded-OCSP-Response-placeholder'],
            },
          },
        ],
      });
    } else if (profile === 'B-LTA') {
      // For B-LTA, you might want to implement additional logic
      // This is just a placeholder similar to your example
    }

    // Sign the credential
    await jades.sign(privateKey, kid);

    // Get the signed result
    const signed = jades.toJSON();

    return NextResponse.json({
      signed,
      profile,
    });
  } catch (error) {
    console.error('Error signing credential:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to sign credential' },
      { status: 500 },
    );
  }
}
