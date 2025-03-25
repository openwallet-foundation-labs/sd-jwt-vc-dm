import { SDJwtGeneralJSONInstance, GeneralJSON } from '@sd-jwt/core';
import { digest, generateSalt } from '@sd-jwt/crypto-nodejs';
import { PresentationFrame } from '@sd-jwt/types';
import { GeneralJWS, SignatureHeader } from './type';
import { getGeneralJSONFromJWSToken } from './utils';

export class Present {
  public static async present<T extends Record<string, unknown>>(
    credential: GeneralJWS | string,
    presentationFrame?: PresentationFrame<T>,
    options?: Record<string, unknown>,
  ): Promise<GeneralJWS> {
    // Initialize the SD JWT instance with proper configuration
    const sdJwtInstance = new SDJwtGeneralJSONInstance({
      hashAlg: 'sha-256',
      hasher: digest,
      saltGenerator: generateSalt,
    });

    // Convert string to GeneralJSON if needed
    const { generalJson: generalJsonCredential, originalHeaders } =
      getGeneralJSONFromJWSToken(credential);

    // If there are no disclosures, return the credential as is
    // This prevents errors from the core library when handling credentials without SD claims
    if (
      !generalJsonCredential.disclosures ||
      generalJsonCredential.disclosures.length === 0
    ) {
      console.log(
        'Credential has no selective disclosure claims, returning as is',
      );

      return this.buildGeneralJWS(generalJsonCredential, originalHeaders);
    }

    // Use the instance's present method for the core SD-JWT functionality
    const presentedCredential = await sdJwtInstance.present(
      generalJsonCredential,
      presentationFrame,
    );

    return this.buildGeneralJWS(presentedCredential, originalHeaders);
  }

  // Builds a GeneralJWS object from the provided JSON and original headers.
  private static buildGeneralJWS(
    json: GeneralJSON,
    headers: SignatureHeader[],
  ) {
    const result = json.toJson();
    return {
      payload: result.payload,
      signatures: result.signatures.map((sig, index) => {
        return {
          ...sig,
          header: {
            ...(headers[index] || {}),
            ...(sig.header || {}),
          },
        };
      }),
    };
  }
}
