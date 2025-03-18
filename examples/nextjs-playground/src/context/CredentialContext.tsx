'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Credential } from '@/types/credential';

interface CredentialContextType {
  issuerCredential: Credential | null;
  holderCredential: Credential | null;
  verifierCredential: Credential | null;
  setIssuerCredential: (credential: Credential | null) => void;
  setHolderCredential: (credential: Credential | null) => void;
  setVerifierCredential: (credential: Credential | null) => void;
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

  return (
    <CredentialContext.Provider
      value={{
        issuerCredential,
        holderCredential,
        verifierCredential,
        setIssuerCredential,
        setHolderCredential,
        setVerifierCredential,
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
