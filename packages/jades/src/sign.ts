import { DisclosureFrame } from '@sd-jwt/types';
import { KeyObject, X509Certificate, createHash } from 'crypto';

export type ProtectedHeader = {
  alg: string;
  typ?: string;

  // TODO: define other headers
  [key: string]: unknown;
};

export type SigD = {
  mId: string;
  pars: [string, string];
  hash: string;
};

export class Sign<T extends Record<string, unknown>> {
  private protectedHeader: Record<string, unknown>;

  /**
   * If undefined, the default disclosure frame will be used.
   * which is set disclosures for every 1-depth property of the payload.
   */
  private disclosureFrame: DisclosureFrame<T> | undefined;

  /**
   * If payload is empty, the data of payload will be empty string.
   * This is the Detached JWS Payload described in TS 119 182-1 v1.2.1 section 5.2.8
   * The sigD header must be present when the payload is empty.
   */
  constructor(private readonly payload?: T) {
    this.protectedHeader = {};
  }

  async sign(key: KeyObject) {
    if (this.payload === undefined) {
      /**
       * If the payload is empty, It uses Detached JWS Payload described in TS 119 182-1 v1.2.1 section 5.2.8
       * So Create manual signature here.
       */
    } else {
      /**
       * Create a General JWS Payload with SD-JWT library.
       */
    }
  }

  setProtectedHeader(header: ProtectedHeader) {
    this.protectedHeader = header;
    return this;
  }

  setB64(b64: boolean) {
    if (b64) {
      this.protectedHeader.b64 = undefined;
    } else {
      this.protectedHeader.b64 = false;
    }
    return this;
  }

  setIssuedAt(sec?: number) {
    this.protectedHeader.iat = sec ?? Math.floor(Date.now() / 1000);
    return this;
  }

  setSignedAt(sec?: number) {
    this.protectedHeader.signedAt = sec ?? Math.floor(Date.now() / 1000);
    return this;
  }

  setSigD(sigd: SigD) {
    this.protectedHeader.sigD = sigd;
    /**
     * TS 119 182-1 v1.2.1 section 5.1.10
     * 
     * If the sigD header parameter is present with its member set to
      "http://uri.etsi.org/19182/HttpHeaders" then the b64 header parameter shall be present and set to
      "false".
     */
    if (sigd.mId === 'http://uri.etsi.org/19182/HttpHeaders') {
      this.setB64(false);
    }
    return this;
  }

  setJti(jti: string) {
    this.protectedHeader.jti = jti;
    return this;
  }

  setX5u(uri: string) {
    this.protectedHeader.x5u = uri;
    return this;
  }

  setX5c(certs: X509Certificate[]) {
    this.protectedHeader.x5c = certs.map((cert) => cert.raw.toString('base64'));
    return this;
  }

  setX5tS256(cert: X509Certificate) {
    this.protectedHeader['x5t#256'] = createHash('sha-256')
      .update(cert.raw)
      .digest('base64url');
    return this;
  }

  setX5tSo(cert: X509Certificate) {
    this.protectedHeader['x5t#o'] = {
      digAlg: 'sha-512',
      digVal: createHash('sha-512').update(cert.raw).digest('base64url'),
    };
    return this;
  }

  setX5ts(certs: X509Certificate[]) {
    if (certs.length < 2) {
      throw new Error(
        'at least 2 certificates are required, use setX5tSo instead',
      );
    }
    this.protectedHeader['x5t#s'] = certs.map((cert) => ({
      digAlg: 'sha-512',
      digVal: createHash('sha-512').update(cert.raw).digest('base64url'),
    }));
    return this;
  }

  setCty(cty: string) {
    this.protectedHeader.cty = cty;
    return this;
  }

  setKid(kid: string) {
    this.protectedHeader.kid = kid;
    return this;
  }
}
