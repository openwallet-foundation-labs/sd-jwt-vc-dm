import { DisclosureTemplate } from '@/types/options';

const basicFrames: Record<string, string[]> = {
  'Driver License': ['license_class', 'license_number', 'name'],
  'VCDM Credential': [
    'vcdm.credentialSubject.given_name',
    'vcdm.credentialSubject.family_name',
  ],
  'Basic Identity': ['given_name', 'family_name', 'email'],
};

const advancedFrames: Record<string, string[]> = {
  'Driver License': [
    'license_class',
    'license_number',
    'name',
    'address',
    'birthdate',
    'issue_date',
    'expiry_date',
    'restrictions',
    'endorsements',
  ],
  'VCDM Credential': [
    'vcdm.credentialSubject.given_name',
    'vcdm.credentialSubject.family_name',
    'vcdm.credentialSubject.email',
    'vcdm.credentialSubject.birthdate',
  ],
  'Basic Identity': [
    'given_name',
    'family_name',
    'email',
    'phone_number',
    'address',
    'birthdate',
    'is_over_18',
    'is_over_21',
    'is_over_65',
  ],
};

export const getDisclosureFrame = (
  template: DisclosureTemplate,
  customFrame: string = '',
  selectedExample: string = 'Basic Identity',
) => {
  switch (template) {
    case DisclosureTemplate.NONE:
      return {};

    case DisclosureTemplate.BASIC: {
      const frame = basicFrames[selectedExample];
      return frame ? { _sd: frame } : {};
    }

    case DisclosureTemplate.ADVANCED: {
      const frame = advancedFrames[selectedExample];
      return frame ? { _sd: frame } : {};
    }

    case DisclosureTemplate.CUSTOM:
      try {
        return JSON.parse(customFrame);
      } catch (e) {
        console.error('Invalid custom disclosure frame JSON', e);
        return {};
      }

    default:
      return {};
  }
};
