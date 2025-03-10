import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fixturesDir = path.join(__dirname, 'fixtures');
export const CERT_PEM = fs.readFileSync(
  path.join(fixturesDir, 'certificate.crt'),
  'utf-8',
);
export const KEY_PEM = fs.readFileSync(
  path.join(fixturesDir, 'private.pem'),
  'utf-8',
);
export const PUBLIC_KEY_PEM = fs.readFileSync(
  path.join(fixturesDir, 'public.pem'),
  'utf-8',
);
export const CERTIFICATE_CSR = fs.readFileSync(
  path.join(fixturesDir, 'certificate.csr'),
  'utf-8',
);
