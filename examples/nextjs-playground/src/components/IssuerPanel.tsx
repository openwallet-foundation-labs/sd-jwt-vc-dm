'use client';
import { useState } from 'react';
import { useCredentials } from '@/context/CredentialContext';
import { JsonEditor } from '@/components/JsonEditor';
import { DisclosureTemplate, JAdESProfile } from '@/types/options';
import { exampleCredentials } from '@/constants/exampleCredentials';
import { getDisclosureFrame } from '@/utils/disclosureFrames.ts';

export function IssuerPanel() {
  const { issuerCredential, setIssuerCredential, setHolderCredential } =
    useCredentials();
  const [selectedExample, setSelectedExample] = useState<string>(''); // Start with no selection
  const [showOptions, setShowOptions] = useState(false);
  const [options, setOptions] = useState({
    jadesProfile: JAdESProfile.BB,
    disclosureTemplate: DisclosureTemplate.NONE,
    customDisclosureFrame: '',
  });
  // These states are used to track the issuing process for user feedback. They are not necessary for the core functionality.
  const [isIssuing, setIsIssuing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExampleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedExample(value);

    if (value) {
      setIssuerCredential({
        content: JSON.stringify(
          exampleCredentials[value as keyof typeof exampleCredentials],
          null,
          2,
        ),
        status: undefined,
      });
    } else {
      // If they select the empty option, clear the credential
      setIssuerCredential(null);
    }
  };

  const handleCredentialChange = (value: string) => {
    setIssuerCredential({
      content: value,
      status: undefined,
    });
  };

  const handleOptionsChange = <
    T extends string | JAdESProfile | DisclosureTemplate,
  >(
    key: keyof typeof options,
    value: T,
  ) => {
    setOptions({
      ...options,
      [key]: value,
    });
  };

  const issueCredential = async () => {
    if (!issuerCredential) return;

    setIsIssuing(true);
    setError(null);

    try {
      // Parse the credential content to send to the API
      const credential = JSON.parse(issuerCredential.content);

      // Create a disclosure frame for selective disclosure
      const disclosureFrame = getDisclosureFrame(
        options.disclosureTemplate,
        options.customDisclosureFrame,
        selectedExample,
      );

      // Call our API endpoint
      const response = await fetch('/api/jades/sign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credential,
          profile: options.jadesProfile,
          disclosureFrame,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to issue credential');
      }

      const data = await response.json();

      // Update the holder credential with the signed credential
      setHolderCredential({
        content: JSON.stringify(data.signed, null, 2),
        status: 'issued',
      });
    } catch (err) {
      setError((err as Error).message);
      console.error('Error issuing credential:', err);
    } finally {
      setIsIssuing(false);
    }
  };

  const getDisclosureLabel = (selectedExample: string) => {
    const labels: Record<string, string> = {
      'Driver License': 'license class, license number, name',
      'VCDM Credential': 'given name, family name',
      'Basic Identity': 'given name, family name, email',
    };
    return labels[selectedExample]
      ? `(${labels[selectedExample]} disclosable)`
      : '';
  };

  return (
    <div className="border rounded-md p-4 mb-4 shadow-sm">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white mr-3">
          <span role="img" aria-label="Issuer">
            🖋️
          </span>
        </div>
        <h2 className="text-xl font-semibold">Issuer</h2>
        <div className="ml-auto">
          <button
            onClick={issueCredential}
            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded"
            disabled={isIssuing}
          >
            {isIssuing ? 'ISSUING...' : 'ISSUE'}
          </button>
        </div>
      </div>

      {/* Error message for user feedback */}
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
            <label className="block text-sm font-medium mb-1">
              JAdES Profile
            </label>
            <select
              id="jadesProfile"
              className="w-full border rounded px-3 py-2"
              value={options.jadesProfile}
              onChange={(e) =>
                handleOptionsChange(
                  'jadesProfile',
                  e.target.value as JAdESProfile,
                )
              }
            >
              <option value={JAdESProfile.BB}>B-B (Basic)</option>
              <option value={JAdESProfile.BT}>B-T (Basic with Time)</option>
              <option value={JAdESProfile.BLT}>B-LT (Basic Long-Term)</option>
              <option value={JAdESProfile.BLTA}>
                B-LTA (Basic Long-Term with Archive)
              </option>
            </select>
            <label className="block text-sm font-medium mb-1">
              Selective Disclosure
            </label>
            <div className="p-3 border rounded bg-gray-50">
              <p className="text-sm mb-2">
                Select fields to be selectively disclosable:
              </p>
              {/* Fields selection UI here */}
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="sd-none"
                    name="sd-template"
                    value="none"
                    checked={
                      options.disclosureTemplate === DisclosureTemplate.NONE
                    }
                    onChange={() =>
                      handleOptionsChange(
                        'disclosureTemplate',
                        DisclosureTemplate.NONE,
                      )
                    }
                    className="mr-2"
                  />
                  <label htmlFor="sd-none" className="text-sm">
                    None (everything disclosed)
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="radio"
                    id="sd-basic"
                    name="sd-template"
                    value="basic"
                    checked={
                      options.disclosureTemplate === DisclosureTemplate.BASIC
                    }
                    onChange={() =>
                      handleOptionsChange(
                        'disclosureTemplate',
                        DisclosureTemplate.BASIC,
                      )
                    }
                    className="mr-2"
                  />
                  <label htmlFor="sd-basic" className="text-sm">
                    Basic {getDisclosureLabel(selectedExample)}
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="radio"
                    id="sd-advanced"
                    name="sd-template"
                    value="advanced"
                    checked={
                      options.disclosureTemplate === DisclosureTemplate.ADVANCED
                    }
                    onChange={() =>
                      handleOptionsChange(
                        'disclosureTemplate',
                        DisclosureTemplate.ADVANCED,
                      )
                    }
                    className="mr-2"
                  />
                  <label htmlFor="sd-advanced" className="text-sm">
                    Advanced (all personal data disclosable)
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="radio"
                    id="sd-custom"
                    name="sd-template"
                    value="custom"
                    checked={
                      options.disclosureTemplate === DisclosureTemplate.CUSTOM
                    }
                    onChange={() =>
                      handleOptionsChange(
                        'disclosureTemplate',
                        DisclosureTemplate.CUSTOM,
                      )
                    }
                    className="mr-2"
                  />
                  <label htmlFor="sd-custom" className="text-sm">
                    Custom
                  </label>
                </div>
              </div>
              {/* custom disclosure frame here when CUSTOM selected */}
              {options.disclosureTemplate === DisclosureTemplate.CUSTOM && (
                <div className="mt-3">
                  <label
                    htmlFor="disclosure-frame"
                    className="block text-sm font-medium mb-1"
                  >
                    Custom Disclosure Frame
                  </label>
                  <textarea
                    id="disclosure-frame"
                    className="w-full h-32 p-2 border rounded font-mono text-xs"
                    value={options.customDisclosureFrame}
                    onChange={(e) =>
                      handleOptionsChange(
                        'customDisclosureFrame',
                        e.target.value,
                      )
                    }
                    placeholder='{"_sd": ["given_name", "family_name", "email"]}'
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">Verifiable Credential</span>
          <select
            className="border rounded px-2 py-1"
            value={selectedExample}
            onChange={handleExampleChange}
          >
            <option value="">Select a credential type</option>
            {Object.keys(exampleCredentials).map((example) => (
              <option key={example} value={example}>
                {example}
              </option>
            ))}
          </select>
        </div>

        {issuerCredential ? (
          <JsonEditor
            value={issuerCredential.content}
            onChange={handleCredentialChange}
            height="400px"
          />
        ) : (
          <div className="p-4 border border-dashed rounded-md text-center text-gray-500 h-[400px] flex items-center justify-center">
            Select a credential type to begin
          </div>
        )}
      </div>
    </div>
  );
}
