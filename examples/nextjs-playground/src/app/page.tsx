'use client';

import { IssuerPanel } from '@/components/IssuerPanel';
import { HolderPanel } from '@/components/HolderPanel';
import { VerifierPanel } from '@/components/VerifierPanel';
import { CredentialProvider } from '@/context/CredentialContext';

export default function Home() {
  return (
    <CredentialProvider>
      <div className="container mx-auto p-4">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">SD-JWT VCDM Playground</h1>
          <p className="text-amber-600">
            ⚠️ Experimental: Not for production. May change or shut down without
            notice.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4">
          <IssuerPanel />
          <HolderPanel />
          <VerifierPanel />
        </div>
      </div>
    </CredentialProvider>
  );
}
