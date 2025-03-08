'use client';

import { Key, useEffect, useMemo, useState } from 'react';
import { useCredentials } from '@/context/CredentialContext';
import { JsonEditor } from '@/components/JsonEditor';
import { JWTViewMode } from '@/types/options';
import { parseSDJson } from '@/utils/parseSDJson';

export function HolderPanel() {
  const { holderCredential, setVerifierCredential } = useCredentials();
  const [showOptions, setShowOptions] = useState(false);
  const [options, setOptions] = useState({
    viewMode: JWTViewMode.DECODED,
  });
  const [presentFrame, setPresentFrame] = useState<Record<string, boolean>>({});
  // These states are used to track the issuing process for user feedback. They are not necessary for the core functionality.
  const [isPresenting, setIsPresenting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Extract disclosures and their field names
  const disclosures = useMemo<Disclosure[]>(() => {
    if (!holderCredential) return [];

    try {
      const parsed = JSON.parse(holderCredential.content);
      const disclosuresList = parsed.signatures?.[0]?.header?.disclosures || [];

      // Map disclosures to their field names and values
      return disclosuresList.map((disclosure: string) => {
        try {
          const decoded = atob(disclosure);
          const parsed = JSON.parse(decoded);
          return {
            disclosure,
            field: parsed[1], // Field name is at index 1
            value: parsed[2], // Value is at index 2
          };
        } catch {
          return {
            disclosure,
            field: `unknown-${Math.random().toString(36).substring(7)}`,
            value: null,
          };
        }
      });
    } catch (e) {
      console.error('Failed to parse disclosures', e);
      return [];
    }
  }, [holderCredential]);

  // Update presentFrame when credential changes to include all fields
  useEffect(() => {
    if (disclosures.length > 0) {
      // Create an initial presentFrame with all fields set to false
      const newPresentFrame: Record<string, boolean> = {};

      disclosures.forEach((item: Disclosure) => {
        newPresentFrame[item.field] = false;
      });

      setPresentFrame(newPresentFrame);
    } else {
      // Reset if no disclosures
      setPresentFrame({});
    }
  }, [disclosures]);

  // Toggle a disclosure selection
  const toggleField = (field: string) => {
    setPresentFrame((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleOptionsChange = <T extends JWTViewMode>(
    key: keyof typeof options,
    value: T,
  ) => {
    setOptions({
      ...options,
      [key]: value,
    });
  };

  // Handle presentation
  const presentCredential = async () => {
    if (!holderCredential) return;

    setIsPresenting(true);
    setError(null);

    try {
      // Call the presentation endpoint
      const response = await fetch('/api/jades/present', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credential: holderCredential.content,
          presentFrame: presentFrame,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create presentation');
      }

      const data = await response.json();

      // Update the verifier credential with the presentation
      setVerifierCredential({
        content: data.credential,
        status: 'presented',
      });
    } catch (err) {
      setError((err as Error).message);
      console.error('Error creating presentation:', err);
    } finally {
      setIsPresenting(false);
    }
  };

  return (
    <div className="border rounded-md p-4 mb-4 shadow-sm">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white mr-3">
          <span role="img" aria-label="Holder">
            👤
          </span>
        </div>
        <h2 className="text-xl font-semibold">Holder</h2>
        <div className="ml-auto">
          <button
            onClick={presentCredential}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            disabled={!holderCredential || isPresenting}
          >
            {isPresenting ? 'PRESENTING...' : 'PRESENT'}
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
                htmlFor="secret"
                className="block text-sm font-medium mb-1"
              >
                Secret
              </label>
              {/* <input
                id="secret"
                className="w-full border rounded px-3 py-2"
                value={options.viewMode}
                onChange={(e) => handleOptionsChange('viewMode', e.target.value)}
              /> */}
            </div>
          </div>
        )}
      </div>

      {holderCredential ? (
        <>
          {/* View mode tabs */}
          <div className="mb-4">
            <div className="flex border-b">
              <button
                className={`px-4 py-2 ${
                  options.viewMode === JWTViewMode.DECODED
                    ? 'border-b-2 border-blue-500'
                    : ''
                }`}
                onClick={() =>
                  handleOptionsChange('viewMode', JWTViewMode.DECODED)
                }
              >
                Decoded View
              </button>
              <button
                className={`px-4 py-2 ${
                  options.viewMode === JWTViewMode.RAW
                    ? 'border-b-2 border-blue-500'
                    : ''
                }`}
                onClick={() => handleOptionsChange('viewMode', JWTViewMode.RAW)}
              >
                Raw JWT
              </button>
            </div>
          </div>

          {/* Content based on view mode */}
          {options.viewMode === JWTViewMode.DECODED ? (
            <div>
              <h3 className="font-medium mb-2">Credential Content</h3>
              {/* Render decoded credential with syntax highlighting */}
              <JsonEditor
                value={JSON.stringify(
                  parseSDJson(holderCredential.content),
                  null,
                  2,
                )}
                readOnly={true}
                height="300px"
              />

              {/* Disclosures selection */}
              {disclosures.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Selective Disclosure</h3>
                  <p className="text-sm mb-2">
                    Select fields to disclose in presentation:
                  </p>

                  <div className="space-y-2 border p-3 rounded">
                    {disclosures.map((item: Disclosure, index: Key) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`field-${index}`}
                          checked={!!presentFrame[item.field]}
                          onChange={() => toggleField(item.field)}
                          className="mr-2"
                        />
                        <label htmlFor={`field-${index}`} className="text-sm">
                          {item.field}: {JSON.stringify(item.value)}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <h3 className="font-medium mb-2">Raw JWT Format</h3>
              <textarea
                className="w-full h-64 p-2 font-mono text-xs border rounded"
                readOnly
                value={holderCredential.content}
              />
            </div>
          )}
        </>
      ) : (
        <div className="p-4 border border-dashed rounded-md text-center text-gray-500">
          No credential received yet. Issue a credential from the Issuer panel.
        </div>
      )}
    </div>
  );
}

interface Disclosure {
  disclosure: string;
  field: string;
  value: string | number | boolean | object | null;
}
