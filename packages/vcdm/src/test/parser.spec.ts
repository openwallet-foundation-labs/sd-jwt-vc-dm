import { describe, it, expect } from 'vitest';
import { parseSdJwtVcdm } from '../parser';
import { VcType } from '../type';

/**
 * header: {
    "alg": "HS256",
    "typ": "dc+sdjwt"
  },
  payload: {
    "vct": "ExampleCredentials",
    "vcdm": {
      "@context": ["https://www.w3.org/2018/credentials/v1"],
      "type": ["VerifiableCredential", "ExampleCredentials"],
      "credentialSubject": {
        "id": "urn:example-id:123",
        "name": "John Doe"
      }
    }
  }
 */
const exampleVcdmJwt =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6ImRjK3Nkand0In0.eyJ2Y3QiOiJFeGFtcGxlQ3JlZGVudGlhbHMiLCJ2Y2RtIjp7IkBjb250ZXh0IjpbImh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzL3YxIl0sInR5cGUiOlsiVmVyaWZpYWJsZUNyZWRlbnRpYWwiLCJFeGFtcGxlQ3JlZGVudGlhbHMiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsiaWQiOiJ1cm46ZXhhbXBsZS1pZDoxMjMiLCJuYW1lIjoiSm9obiBEb2UifX19.nQ0ppfHDwxXEvQ1w-Ym0lLE-ifW2pnNVUBFbok_iVtE';

/**
 * header: { typ: 'dc+sd-jwt', alg: 'ES256' },
 * payload: {
    iss: 'Issuer',
    iat: 1739949212870,
    vct: 'ExampleCredentials',
    lastname: 'Doe',
    ssn: '123-45-6789',
    data: { firstname: 'John', lastname: 'Doe', ssn: '123-45-6789' },
    firstname: 'John',
    id: '1234'
  }
 */
const exampleSdJwtVcJwt =
  'eyJ0eXAiOiJkYytzZC1qd3QiLCJhbGciOiJFUzI1NiJ9.eyJpc3MiOiJJc3N1ZXIiLCJpYXQiOjE3Mzk5NDg5Nzg3NjYsInZjdCI6IkV4YW1wbGVDcmVkZW50aWFscyIsImxhc3RuYW1lIjoiRG9lIiwic3NuIjoiMTIzLTQ1LTY3ODkiLCJkYXRhIjp7ImZpcnN0bmFtZSI6IkpvaG4iLCJsYXN0bmFtZSI6IkRvZSIsInNzbiI6IjEyMy00NS02Nzg5IiwiX3NkIjpbIkZNQzdBS1BwNTJjazctU1hWVURoWEdpandqUEtkQWtNem9tUmV5dF81YW8iLCJsaGthVFltUDFGdHgyT3RPMkdZa1BsaWpTeEpBTkt6M192QV96YkF5azI4IiwieGFMalpTMzJ1NXdtbjh5UHdSWktUX3Jwb0J4WTJpajZJQXRnWTZ5TXBnZyJdfSwiX3NkIjpbIjZDWXVhdFZEUXRsVHBNTkdfVWQxdy1sdW0yTnZkOGJ4TktRRUVJWkRWWjQiLCJNNEFNVTNyMnRKUG1PYnFIVlo3dUZVY2dxX3lIMzNOWVJiZzJFRW5rVW1rIiwiaE1BTDlmTjRfVjRQVV9LelhFU3lQaHF3RGhvVXNsV0RyLWFsOTQxOWk1WSJdLCJfc2RfYWxnIjoic2hhLTI1NiJ9.tZ3D-AFoNfZLWLwyr76dM8UnUd0na7CjeAAgKS925K0b_bTw7zPACWGfme9POfwELlBLsWiZGOo-SnoJ0doxag~WyJkMGNiZjI1OTBkNWVlOGNjIiwiZmlyc3RuYW1lIiwiSm9obiJd~WyI1NDFjY2JhNmQyYmZjMGJjIiwiaWQiLCIxMjM0Il0~';

describe('parse', () => {
  it('should parse VCDM JWT correctly', () => {
    const result = parseSdJwtVcdm(exampleVcdmJwt);
    expect(result.type).toEqual(VcType.W3C_VCDM);
    expect(result.payload).toEqual({
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiableCredential', 'ExampleCredentials'],
      credentialSubject: {
        id: 'urn:example-id:123',
        name: 'John Doe',
      },
    });
  });

  it('should parse SD-JWT VC correctly', () => {
    const result = parseSdJwtVcdm(exampleSdJwtVcJwt);
    expect(result.type).toEqual(VcType.SD_JWT_VC);
    expect(result.payload).toEqual({
      iss: 'Issuer',
      iat: 1739948978766,
      firstname: 'John',
      lastname: 'Doe',
      ssn: '123-45-6789',
      data: { firstname: 'John', lastname: 'Doe', ssn: '123-45-6789' },
      id: '1234',
      vct: 'ExampleCredentials',
    });
  });
});
