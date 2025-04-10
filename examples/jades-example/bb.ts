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
    .sign(privateKey, kid);

  const serialized = jades.toJSON();
  console.log(serialized);
})();
