export const exampleCredentials = {
  'Basic Identity': {
    vct: 'https://credentials.example.com/identity_credential',
    iss: 'https://issuer.example.com',
    iat: 1683000000,
    exp: 1883000000,
    cnf: {
      jwk: {
        kty: 'EC',
        crv: 'P-256',
        x: 'TCAER19Zvu3OHF4j4W4vfSVoHIP1ILilDls7vCeGemc',
        y: 'ZxjiWWbZMQGHVWKVQ4hbSIirsVfuecCE6t4jT9F2HZQ',
      },
    },
    given_name: 'John',
    family_name: 'Doe',
    email: 'johndoe@example.com',
    phone_number: '+1-202-555-0101',
    address: {
      street_address: '123 Main St',
      locality: 'Anytown',
      region: 'Anystate',
      country: 'US',
    },
    birthdate: '1940-01-01',
    is_over_18: true,
    is_over_21: true,
    is_over_65: true,
  },
  'Driver License': {
    vct: 'https://credentials.example.com/drivers_license',
    iss: 'https://dmv.example.gov',
    iat: 1683000000,
    exp: 1793000000,
    cnf: {
      jwk: {
        kty: 'EC',
        crv: 'P-256',
        x: 'TCAER19Zvu3OHF4j4W4vfSVoHIP1ILilDls7vCeGemc',
        y: 'ZxjiWWbZMQGHVWKVQ4hbSIirsVfuecCE6t4jT9F2HZQ',
      },
    },
    license_class: 'C',
    license_number: 'DL123456789',
    name: {
      given_name: 'Jane',
      family_name: 'Doe',
    },
    address: {
      street_address: '456 Oak Ave',
      locality: 'Springfield',
      region: 'State',
      country: 'US',
    },
    birthdate: '1985-05-15',
    issue_date: '2020-05-15',
    expiry_date: '2028-05-15',
    restrictions: ['corrective_lenses'],
    endorsements: ['motorcycle'],
  },
  'VCDM Credential': {
    vct: 'https://credentials.example.com/identity_credential',
    iss: 'https://issuer.example.com',
    iat: 1683000000,
    exp: 1883000000,
    cnf: {
      jwk: {
        kty: 'EC',
        crv: 'P-256',
        x: 'TCAER19Zvu3OHF4j4W4vfSVoHIP1ILilDls7vCeGemc',
        y: 'ZxjiWWbZMQGHVWKVQ4hbSIirsVfuecCE6t4jT9F2HZQ',
      },
    },
    vcdm: {
      '@context': ['https://www.w3.org/ns/credentials/v2'],
      type: [
        'VerifiableCredential',
        'https://credentials.example.com/identity_credential',
      ],
      credentialSubject: {
        given_name: 'John',
        family_name: 'Doe',
        email: 'johndoe@example.com',
        birthdate: '1940-01-01',
      },
    },
  },
};
