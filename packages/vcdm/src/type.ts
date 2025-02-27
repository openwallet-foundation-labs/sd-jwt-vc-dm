/**
 * Implementaters of SD-JWT VCDM MUST use valid values for both vct Claim defined in IETF SD-JWT VC [@!I-D.ietf-oauth-sd-jwt-vc] and type proprty defined in W3C VCDM [@!W3C.VCDM1.1] or [@!W3C.VCDM2.0].

  For backward compatibility with JWT processors, the following registered JWT claims MUST be used, instead of their respective counterpart properties in W3C VCDM [@!W3C.VCDM1.1] or [@!W3C.VCDM2.0]:

    - To represent the validity period of SD-JWT VCDM (i.e., cryptographic signature), exp/iat Claims encoded as a UNIX timestamp (NumericDate) MUST be used, and not expirationDate and issuanceDate properties defined in [@!W3C.VCDM1.1], validFrom and validTo properties defined in [@!W3C.VCDM2.0].
    - iss Claim MUST represent the identifier of the issuer property, i.e., the issuer property value if issuer is a String, or the id property of the issuer object if issuer is an object. issuer property MUST be ignored if present.
    - status Claim MUST represent credentialStatus property. credentialStatus property MUST be ignored if present.
    - sub Claim MUST represent the id property of credentialSubject property. credentialSubject property MUST be ignored if present.

  IETF SD-JWT VC is extended with the following claims:

    - vcdm: OPTIONAL. Contains properties defined in [@!W3C.VCDM1.1] or [@!W3C.VCDM2.0] that are not represented by their counterpart JWT Claims as defined above.

  The following outlines a suggested non-normative processing steps for SD-JWT VCDM:

    - SD-JWT VC Processing:

      A receiver (holder or verifier) of an SD-JWT VCDM applies the processing rules outlined in Section 4 of [@!I-D.ietf-oauth-sd-jwt-vc], including verifying signatures, validity periods, status information, etc.
      If the vct value is associated with any SD-JWT VC Type Metadata, schema validation of the entire SD-JWT VCDM is performed, including the nested vcdm claim.
      Additionally, trust framework rules are applied, such as ensuring the issuer is authorized to issue SD-JWT VCDMs for the specified vct value.

    - Business Logic Processing:

      Once the SD-JWT VC is verified and trusted by the SD-JWT VC processor, and if the vcdm claim is present, the receiver extracts the VCDM (1.1 or 2.0) object from the vcdm claim and uses this for the business logic object. If the vcdm claim is not present, the entire SD-JWT VC is considered to represent the business logic object.
      The business logic object is then passed on for further use case-specific processing and validation. The business logic assumes that all security-critical functions (e.g., signature verification, trusted issuer) have already been performed during the previous step. Additional schema validation is applied if provided in the vcdm claim, e.g., to support SHACL schemas. Note that while a vct claim is required, SD-JWT VC type metadata resolution and related schema validation is optional in certain cases.

 */

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
