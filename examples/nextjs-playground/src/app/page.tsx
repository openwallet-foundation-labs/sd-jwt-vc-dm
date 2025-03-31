'use client';

import { IssuerPanel } from '@/components/IssuerPanel';
import { HolderPanel } from '@/components/HolderPanel';
import { VerifierPanel } from '@/components/VerifierPanel';
import { CredentialProvider } from '@/context/CredentialContext';

export default function Home() {
  return (
    <CredentialProvider>
      <div className="grid grid-cols-1 gap-4">
        <IssuerPanel />
        <HolderPanel />
        <VerifierPanel />
      </div>
    </CredentialProvider>
  );
}
