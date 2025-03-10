export const parseSDJson = (content: string) => {
  try {
    // First try to parse as JSON (in case it's already in JSON format)
    const parsed = JSON.parse(content);

    // If it has a payload property that's base64 encoded, decode it
    if (parsed.payload && typeof parsed.payload === 'string') {
      try {
        const decodedPayload = JSON.parse(
          atob(parsed.payload.replace(/-/g, '+').replace(/_/g, '/')),
        );
        parsed.payload = decodedPayload;
      } catch {
        // If payload decoding fails, leave it as is
      }
    }

    // If it has signatures with protected headers, decode those too
    if (parsed.signatures && Array.isArray(parsed.signatures)) {
      parsed.signatures = parsed.signatures.map(
        (sig: { protected: string }) => {
          if (sig.protected && typeof sig.protected === 'string') {
            try {
              const decodedProtected = JSON.parse(
                atob(sig.protected.replace(/-/g, '+').replace(/_/g, '/')),
              );
              return {
                ...sig,
                protected: decodedProtected,
              };
            } catch {
              // If protected decoding fails, return signature as is
              return sig;
            }
          }
          return sig;
        },
      );
    }
    return parsed;
  } catch {
    // If it's not valid JSON, return an empty object
    return {};
  }
};
