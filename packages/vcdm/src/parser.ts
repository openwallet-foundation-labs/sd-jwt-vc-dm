import { Vcdm, VcType } from './type';
import {
  decodeJwt,
  decodeSdJwtSync,
  getClaimsSync,
  splitSdJwt,
} from '@sd-jwt/decode';
import { hasher } from '@sd-jwt/hash';
import { SdJwtVcPayload } from '@sd-jwt/sd-jwt-vc';

/**
 * Parses an SD-JWT VCDM from a SD-JWT or JWT string.
 *
 * @param sdjwtOrjwt - The SD-JWT or JWT string to parse.
 * @returns The parsed VCDM object or parsed SD-JWT VC object with type property set to SD-JWT VC or W3C VCDM.
 */
export const parseSdJwtVcdm = (sdjwtOrjwt: string) => {
  const { jwt } = splitSdJwt(sdjwtOrjwt);
  const { payload } = decodeJwt(jwt);

  if (payload.vct === undefined) {
    throw new Error('vct claim is required');
  }

  if (payload.vcdm !== undefined) {
    return {
      type: VcType.W3C_VCDM,
      payload: payload.vcdm as Vcdm,
    };
  }

  const decodedSdJwt = decodeSdJwtSync(sdjwtOrjwt, hasher);
  const claims = getClaimsSync(
    decodedSdJwt.jwt.payload,
    decodedSdJwt.disclosures,
    hasher,
  );

  return {
    type: VcType.SD_JWT_VC,
    payload: claims as SdJwtVcPayload,
  };
};
