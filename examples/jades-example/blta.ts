import { JAdES, parseCerts, createKidFromCert } from 'sd-jwt-jades';
import * as fs from 'fs';
import { createPrivateKey } from 'node:crypto';

(async () => {
  const jades = new JAdES.Sign({ data: 'data 1', target: 'data 2' });

  const certPem = fs.readFileSync('./fixtures/certificate.crt', 'utf-8');
  const certs = parseCerts(certPem);
  const kid = createKidFromCert(certs[0]);

  const keyPem = fs.readFileSync('./fixtures/private.pem', 'utf-8');
  const privateKey = createPrivateKey(keyPem);

  await jades
    .setProtectedHeader({
      alg: 'RS256',
      typ: 'jades',
    })
    .setX5c(certs)
    .setDisclosureFrame({
      _sd: ['data'],
    })
    .setSignedAt()
    .setUnprotectedHeader({
      etsiU: [
        {
          sigTst: {
            tstTokens: [
              {
                val: 'Base64-encoded RFC 3161 Timestamp Token',
              },
            ],
          },
        },
        {
          xVals: [
            { x509Cert: 'Base64-encoded Trust Anchor' },
            { x509Cert: 'Base64-encoded CA Certificate' },
          ],
        },
        {
          rVals: {
            crlVals: ['Base64-encoded CRL'],
            ocspVals: ['Base64-encoded OCSP Response'],
          },
        },
        {
          arcTst: {
            tstTokens: [
              {
                val: 'Base64-encoded Archive Timestamp Token',
              },
            ],
            canonAlg: 'http://uri.etsi.org/19182/canon/json',
          },
        },
      ],
    })
    .sign(privateKey, kid);

  const serialized = jades.toJSON();
  console.log(serialized);
})();
