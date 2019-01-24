let flag = true;

export const checkKYCProfile = kycProfile => {
  flag = true;
  const keys = Object.keys(kycProfile);

  for (let i = 0; i < keys.length; i++) {
    if (
      kycProfile[`${keys[i]}`] !== null &&
      kycProfile[`${keys[i]}`] !== undefined &&
      typeof kycProfile[`${keys[i]}`] === 'object'
    ) {
      checkKYCProfile(kycProfile[`${keys[i]}`]);
    } else if (
      kycProfile[`${keys[i]}`] === null ||
      kycProfile[`${keys[i]}`] === undefined ||
      kycProfile[`${keys[i]}`] === ''
    ) {
      flag = false;
      break;
    }
  }

  return flag;
};
