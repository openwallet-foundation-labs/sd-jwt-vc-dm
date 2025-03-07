'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type Credential = {
  content: string;
  status?: 'issued' | 'presented' | 'verified' | 'unverified';
};

interface CredentialContextType {
  issuerCredential: Credential | null;
  holderCredential: Credential | null;
  verifierCredential: Credential | null;
  setIssuerCredential: (credential: Credential | null) => void;
  setHolderCredential: (credential: Credential | null) => void;
  setVerifierCredential: (credential: Credential | null) => void;
  verifyCredential: () => void;
}

const CredentialContext = createContext<CredentialContextType | undefined>(
  undefined,
);

export function CredentialProvider({ children }: { children: ReactNode }) {
  const [issuerCredential, setIssuerCredential] = useState<Credential | null>(
    null,
  );
  const [holderCredential, setHolderCredential] = useState<Credential | null>(
    null,
  );
  const [verifierCredential, setVerifierCredential] =
    useState<Credential | null>(null);

  const verifyCredential = () => {
    if (verifierCredential) {
      // In a real implementation, we would use the library to verify the credential
      // For now, just mark as verified or unverified randomly
      setVerifierCredential({
        ...verifierCredential,
        status: Math.random() > 0.2 ? 'verified' : 'unverified',
      });
    }
  };

  return (
    <CredentialContext.Provider
      value={{
        issuerCredential,
        holderCredential,
        verifierCredential,
        setIssuerCredential,
        setHolderCredential,
        setVerifierCredential,
        verifyCredential,
      }}
    >
      {children}
    </CredentialContext.Provider>
  );
}

export const useCredentials = () => {
  const context = useContext(CredentialContext);
  if (context === undefined) {
    throw new Error('useCredentials must be used within a CredentialProvider');
  }
  return context;
};
