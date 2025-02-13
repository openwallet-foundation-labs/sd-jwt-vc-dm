import { ALGORITHMS, CommitmentOIDs } from './constant';

export type ProtectedHeader = {
  alg: Alg;
  typ?: string;

  // TODO: define other headers
  [key: string]: unknown;
};

export type SigD = {
  mId: string;
  pars: [string, string];
  hash: string;
};

export type Alg = keyof typeof ALGORITHMS;

export type GeneralJWS = {
  payload: string;
  signatures: Array<{
    protected: string;
    signature: string;

    /**
     * This is a optional unprotected header.
     *
     */
    header: {
      disclosures?: Array<string>;
      kid?: string;
      kb_jwt?: string;

      /**
       * TODO: add JAdES unprotected header
       */
      etsiU?: any;
    };
  }>;
};

export type CommitmentOption = Array<{
  commId: string | CommitmentOIDs;
  commQuals?: Array<Record<string, unknown>>;
}>;
