import moment from 'moment';

export const formatKYCProfile = profile => {
  const customerVerifyRequest = {
    dateOfBirth: profile.dateOfBirth ? moment(profile.dateOfBirth).valueOf() : null,
    identity: {
      identity:
        profile.identities && profile.identities.length > 0 ? profile.identities[0].identity : null,
      fullname: profile.fullname,
      genderId:
        profile.gender !== null && typeof profile.gender === 'object'
          ? profile.gender.id
          : profile.gender,
      dateIssued:
        profile.identities && profile.identities.length > 0
          ? moment(profile.identities[0].dateIssued).valueOf()
          : null,
      issuePlace:
        profile.identities && profile.identities.length > 0
          ? profile.identities[0].issuePlace
          : null
    },
    permanentResident:
      profile && profile.addresses && profile.addresses.length > 0
        ? profile.addresses[0].street1
        : null,
    province:
      profile && profile.addresses && profile.addresses.length > 0
        ? profile.addresses[0].province
        : null,
    district:
      profile && profile.addresses && profile.addresses.length > 0
        ? profile.addresses[0].district
        : null
  };

  return customerVerifyRequest;
};

export const formatInitialValuesProfile = profile => ({
  enableReinitialize: true,
  nickName: profile.nickName || '',
  displayName: profile.fullname ? profile.fullname : '',
  firstName: profile.firstName ? profile.firstName : '',
  lastName: profile.lastName ? profile.lastName : '',
  email: profile.email ? profile.email : '',
  dateOfBirth: profile.dateOfBirth
    ? {
        full: profile.dateOfBirth,
        name: moment(profile.dateOfBirth).format('DD-MM-YYYY'),
        value: moment(profile.dateOfBirth).valueOf()
      }
    : null,
  identityId:
    profile && profile.identities && profile.identities.length > 0
      ? profile.identities[0].identity
      : '',
  placeOfIssued:
    profile && profile.identities && profile.identities.length > 0
      ? profile.identities[0].issuePlace
      : null,
  issuedDate:
    profile &&
    profile.identities &&
    profile.identities.length > 0 &&
    profile.identities[0].dateIssued
      ? {
          name: moment(profile.identities[0].dateIssued).format('DD-MM-YYYY'),
          full: profile.identities[0].dateIssued,
          value: moment(profile.identities[0].dateIssued).valueOf()
        }
      : null,
  // country: profile.country ? profile.country : '',
  country: 'Việt Nam',
  district: profile.district ? profile.district : '',
  province: profile.province ? profile.province : '',
  gender:
    profile.gender === null
      ? null
      : profile.gender === 0
        ? { id: 0, value: 'Male' }
        : profile.gender === 1 ? { id: 1, value: 'Female' } : { id: 2, value: 'Other' },
  currentDistrict:
    profile && profile.addresses && profile.addresses.length > 0 && profile.addresses[0].district
      ? profile.addresses[0].district
      : '',
  currentProvince:
    profile && profile.addresses && profile.addresses.length > 0 && profile.addresses[0].province
      ? profile.addresses[0].province
      : '',
  addressName:
    (profile &&
      profile.addresses &&
      profile.addresses.length > 0 &&
      profile.addresses[0].street1) ||
    '',
  currentAddress: profile.livingAddress
});

export const formatKYCProfileUpdate = values => {
  const customerVerifyRequest = {
    dateOfBirth: values.dateOfBirth
      ? moment(values.dateOfBirth).valueOf()
      : values.dateOfBirth && values.dateOfBirth !== null ? values.dateOfBirth.value || null : null,
    identity: {
      identity: values.identityId,
      fullname: values.displayName ? values.displayName.trim() : null,
      // genderId: values.gender && values.gender.id,
      dateIssued: values.issuedDate && values.issuedDate.value,
      issuePlace:
        values.placeOfIssued && values.placeOfIssued.code
          ? values.placeOfIssued.code
          : values.placeOfIssued
    },
    permanentResident: values.addressName ? values.addressName.trim() : null,
    province: values.province && values.province.code ? values.province.code : values.province,
    district: values.district && values.district.code ? values.district.code : values.district
  };

  return customerVerifyRequest;
};

export const formatAdditionalProfileUpdate = values => {
  const additionalData = {
    email: values.email,
    livingAddress: values.currentAddress || null,
    province: values.currentProvince.code ? values.currentProvince.code : values.currentProvince,
    district: values.currentDistrict.code ? values.currentDistrict.code : values.currentDistrict,
    jobOccupation: values.occupation ? values.occupation.id : null,
    jobPosition: values.position ? values.position.id : null,
    nickName: values.nickName
  };

  return normalizeAdditionalProfileUpdate(additionalData);
};

export const normalizeAdditionalProfileUpdate = profile => {
  for (const property in profile) {
    if (profile.hasOwnProperty(property)) {
      if (
        typeof profile[property] === 'object' &&
        profile[property] !== null &&
        profile[property] !== undefined
      ) {
        normalizeAdditionalProfileUpdate(profile[property]);
      } else if (
        (typeof profile[property] === 'string' && profile[property].trim() === '') ||
        profile[property] === undefined
      ) {
        profile[property] = null;
      }
    }
  }
  return profile;
};
