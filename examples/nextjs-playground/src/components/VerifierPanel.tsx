'use client';

import { useState } from 'react';
import { useCredentials } from '@/context/CredentialContext';
import { JsonEditor } from '@/components/JsonEditor';
import { parseSDJson } from '@/utils/parseSDJson';

export function VerifierPanel() {
  const { verifierCredential, setVerifierCredential } = useCredentials();
  const [showOptions, setShowOptions] = useState(false);
  const [options, setOptions] = useState({
    challenge: 'verifierChallenge',
    domain: 'example.org',
    additionalContexts: '"https://schema.org/"',
  });
  // These states are used to track the issuing process for user feedback. They are not necessary for the core functionality.
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verifyCredential = async () => {
    if (!verifierCredential) return;

    setIsVerifying(true);
    setError(null);

    try {
      // Call the verification endpoint
      const response = await fetch('/api/jades/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credential: verifierCredential.content,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create presentation');
      }
      const data = await response.json();
      // Set the verification result
      setVerifierCredential({
        ...verifierCredential,
        status: data.verified ? 'verified' : 'unverified',
      });
    } catch (err) {
      setError((err as Error).message);
      console.error('Error verifying presentation:', err);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleOptionsChange = (
    key: keyof typeof options,
    value: string | boolean | number,
  ) => {
    setOptions({
      ...options,
      [key]: value,
    });
  };

  return (
    <div className="border rounded-md p-4 mb-4 shadow-sm">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white mr-3">
          <span role="img" aria-label="Verifier">
            ✓
          </span>
        </div>
        <h2 className="text-xl font-semibold">Verifier</h2>
        <div className="ml-auto">
          <button
            onClick={verifyCredential}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            disabled={!verifierCredential || isVerifying}
          >
            {isVerifying ? 'Verifying...' : 'Verify'}
          </button>
        </div>
      </div>

      {/* error message for user feedback */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Options Section with standard HTML */}
      <div className="mb-4 border-b pb-2">
        <button
          className="flex items-center justify-between w-full text-left font-medium"
          onClick={() => setShowOptions(!showOptions)}
        >
          Options
          <span>{showOptions ? '▼' : '►'}</span>
        </button>

        {showOptions && (
          <div className="mt-2 space-y-4">
            <div>
              <label
                htmlFor="verifierChallenge"
                className="block text-sm font-medium mb-1"
              >
                Challenge
              </label>
              <input
                id="verifierChallenge"
                className="w-full border rounded px-3 py-2"
                value={options.challenge}
                onChange={(e) =>
                  handleOptionsChange('challenge', e.target.value)
                }
              />
            </div>
            <div>
              <label
                htmlFor="domain"
                className="block text-sm font-medium mb-1"
              >
                Domain
              </label>
              <input
                id="domain"
                className="w-full border rounded px-3 py-2"
                value={options.domain}
                onChange={(e) => handleOptionsChange('domain', e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="additionalContexts"
                className="block text-sm font-medium mb-1"
              >
                Additional Contexts for VP
              </label>
              <input
                id="additionalContexts"
                className="w-full border rounded px-3 py-2"
                value={options.additionalContexts}
                onChange={(e) =>
                  handleOptionsChange('additionalContexts', e.target.value)
                }
              />
            </div>
          </div>
        )}
      </div>

      {verifierCredential ? (
        <div>
          <div className="flex items-center mb-2">
            <span className="font-medium">Verifiable Presentation</span>
            <span
              className={`ml-2 px-2 py-1 text-xs rounded ${
                verifierCredential.status === 'verified'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {verifierCredential.status === 'verified'
                ? 'verified'
                : 'unverified'}
            </span>
          </div>
          <JsonEditor
            value={JSON.stringify(
              parseSDJson(verifierCredential.content),
              null,
              2,
            )}
            readOnly={true}
            height="300px"
          />
        </div>
      ) : (
        <div className="p-4 border border-dashed rounded-md text-center text-gray-500">
          No presentation received yet. Present a credential from the Holder
          panel.
        </div>
      )}
    </div>
  );
}
