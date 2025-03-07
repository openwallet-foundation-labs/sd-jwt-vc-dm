import { DisclosureTemplate } from '@/types/options';

export const getDisclosureFrame = (
  template: DisclosureTemplate,
  customFrame: string = '',
) => {
  switch (template) {
    case DisclosureTemplate.NONE:
      return {};
    case DisclosureTemplate.BASIC:
      return { _sd: ['given_name', 'family_name', 'email'] };
    case DisclosureTemplate.ADVANCED:
      return {
        _sd: [
          'given_name',
          'family_name',
          'email',
          'phone_number',
          'address',
          'birthdate',
        ],
      };
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
