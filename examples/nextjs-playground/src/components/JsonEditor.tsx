'use client';

import { useState } from 'react';

interface JsonEditorProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  height?: string;
}

export function JsonEditor({
  value,
  onChange,
  readOnly = false,
  height = '300px',
}: JsonEditorProps) {
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (onChange) {
      onChange(newValue);
    }

    // Basic JSON validation
    try {
      if (newValue.trim()) {
        JSON.parse(newValue);
        setError(null);
      }
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const formatJson = () => {
    try {
      const formatted = JSON.stringify(JSON.parse(value), null, 2);
      if (onChange) {
        onChange(formatted);
      }
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-1">
        {!readOnly && (
          <button
            onClick={formatJson}
            className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
          >
            Format
          </button>
        )}
      </div>
      <textarea
        value={value}
        onChange={handleChange}
        readOnly={readOnly}
        style={{ height }}
        className="w-full font-mono text-sm p-2 border rounded bg-gray-50 overflow-auto"
        spellCheck="false"
      />
      {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
    </div>
  );
}
