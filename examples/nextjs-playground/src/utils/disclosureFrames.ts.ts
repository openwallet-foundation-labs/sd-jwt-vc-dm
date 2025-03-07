import { DisclosureTemplate } from '@/types/options';

export const getDisclosureFrame = (
  template: DisclosureTemplate,
  customFrame: string = '',
  selectedExample: string = 'Basic Identity',
) => {
  switch (template) {
    case DisclosureTemplate.NONE:
      return {};

    case DisclosureTemplate.BASIC:
      // Return fields based on credential type
      if (selectedExample === 'Driver License') {
        return {
          _sd: ['license_class', 'license_number', 'name'],
        };
      } else if (selectedExample === 'VCDM Credential') {
        return {
          _sd: [
            'vcdm.credentialSubject.given_name',
            'vcdm.credentialSubject.family_name',
          ],
        };
      } else {
        // Default for Basic Identity
        return {
          _sd: ['given_name', 'family_name', 'email'],
        };
      }

    case DisclosureTemplate.ADVANCED:
      // Return more fields based on credential type
      if (selectedExample === 'Driver License') {
        return {
          _sd: [
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
        };
      } else if (selectedExample === 'VCDM Credential') {
        return {
          _sd: [
            'vcdm.credentialSubject.given_name',
            'vcdm.credentialSubject.family_name',
            'vcdm.credentialSubject.email',
            'vcdm.credentialSubject.birthdate',
          ],
        };
      } else {
        // Default for Basic Identity
        return {
          _sd: [
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
