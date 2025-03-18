type VerificationResult = {
  payload: any;
  headers: any[];
  keyBinding?: {
    payload: any;
    header: any;
  };
  verificationTime?: string;
};

export type Credential = {
  content: string;
  status?: 'issued' | 'presented' | 'verified' | 'unverified';
  verificationResult?: VerificationResult;
};
