import { normalizePhoneNumber } from '../validators/authentication';

export const formatPhoneNumber = phoneNumber => {
  let formattedPhoneNumber = '';
  let normalizedPhoneNumber = normalizePhoneNumber(phoneNumber);
  const normalizedPhoneNumberLength = normalizedPhoneNumber.length;
  if (normalizedPhoneNumberLength > 0 && !normalizedPhoneNumber.startsWith('0')) {
    normalizedPhoneNumber = `0${normalizedPhoneNumber}`;
  }

  formattedPhoneNumber = normalizedPhoneNumber;

  if (normalizePhoneNumber <= 4) {
    formattedPhoneNumber = `${normalizePhoneNumber}`;
  }
  if (
    normalizedPhoneNumberLength > 4 &&
    normalizedPhoneNumberLength < 8 &&
    !normalizedPhoneNumber.endsWith(' ')
  ) {
    formattedPhoneNumber = `${normalizedPhoneNumber.substring(
      0,
      4
    )} ${normalizedPhoneNumber.substring(4, normalizedPhoneNumberLength)}`;
  }

  if (normalizedPhoneNumberLength > 7) {
    formattedPhoneNumber = `${normalizedPhoneNumber.substring(
      0,
      4
    )} ${normalizedPhoneNumber.substring(4, 7)} ${normalizedPhoneNumber.substring(
      7,
      normalizedPhoneNumberLength
    )}`;
  }

  return formattedPhoneNumber;
};
