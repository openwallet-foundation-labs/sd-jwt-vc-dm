import { X509Certificate } from 'crypto';

export const parseCerts = (chainPem: string): X509Certificate[] => {
  return chainPem
    .split(/(?=-----BEGIN CERTIFICATE-----)/g)
    .filter((cert) => cert.trim().length > 0)
    .map((cert) => new X509Certificate(cert));
};
