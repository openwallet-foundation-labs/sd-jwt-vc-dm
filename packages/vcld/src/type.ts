import { SdJwtVcPayload } from '@sd-jwt/sd-jwt-vc';

export type SDJwtVcdmPayload =
  | {
      vct: string;
      vcdm: Vcdm;
    }
  | SdJwtVcPayload;

export enum VcType {
  SD_JWT_VC = 'sd-jwt-vc',
  W3C_VCDM = 'w3c-vcdm',
}

export type Vcdm = {
  '@context': string[];
  type: string[];
  credentialSubject: Record<string, unknown>;
  [key: string]: unknown;
};
