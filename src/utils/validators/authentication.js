const carriers = {
  '096': 'Viettel',
  '097': 'Viettel',
  '098': 'Viettel',
  '032': 'Viettel',
  '033': 'Viettel',
  '034': 'Viettel',
  '035': 'Viettel',
  '036': 'Viettel',
  '037': 'Viettel',
  '038': 'Viettel',
  '039': 'Viettel',
  '086': 'Viettel',
  '088': 'Viettel',
  '089': 'Viettel',

  '090': 'Mobifone',
  '093': 'Mobifone',
  '070': 'Mobifone',
  '079': 'Mobifone',
  '077': 'Mobifone',
  '076': 'Mobifone',
  '078': 'Mobifone',

  '091': 'Vinaphone',
  '094': 'Vinaphone',
  '083': 'Vinaphone',
  '084': 'Vinaphone',
  '085': 'Vinaphone',
  '081': 'Vinaphone',
  '082': 'Vinaphone',

  '0993': 'Gmobile',
  '0994': 'Gmobile',
  '0995': 'Gmobile',
  '0996': 'Gmobile',
  '0997': 'Gmobile',
  '0599': 'Gmobile',
  '0598': 'Gmobile',
  '0593': 'Gmobile',
  '0592': 'Gmobile',

  '092': 'Vietnamobile',
  '0588': 'Vietnamobile',
  '0565': 'Vietnamobile',
  '0566': 'Vietnamobile',
  '0567': 'Vietnamobile',
  '0568': 'Vietnamobile',
  '0569': 'Vietnamobile',
  '0582': 'Vietnamobile',
  '0583': 'Vietnamobile',
  '0584': 'Vietnamobile',
  '0585': 'Vietnamobile',
  '0586': 'Vietnamobile',
  '0587': 'Vietnamobile',
  '0589': 'Vietnamobile',
  '0562': 'Vietnamobile',
  '0563': 'Vietnamobile',
  '0564': 'Vietnamobile'
};

const phoneNumberErrors = {
  phoneNumberLengthError: "Phonenumber's length must be in range of 10 and 13",
  phoneNumberNotFoundError: 'Phonenumber is incorrect'
};

export const validatePhoneNumber = phoneNumber => {
  const normalizedPhoneNumber = normalizePhoneNumber(phoneNumber);
  if (normalizedPhoneNumber.length < 10 || normalizedPhoneNumber.length > 13) {
    return phoneNumberErrors.phoneNumberLengthError;
  }

  let flag = false;
  Object.keys(carriers).forEach(carrier => {
    if (normalizedPhoneNumber.startsWith(carrier)) {
      flag = true;
    }
  });
  if (!flag) {
    return phoneNumberErrors.phoneNumberNotFoundError;
  }

  return null;
};

export const normalizePhoneNumber = phoneNumber =>
  phoneNumber.replace(/\s/g, '');

const nameErrors = {
  nameLengthError: 'Name is incorrect',
  nameMaxLengthError: 'Name has no more than 50 characters',
  numberOfWordsLengthError: 'Name has at least 2 words',
  maxWordLengthError:
    'Each word must have minimum 1 characters and maximum 10 characters',
  nameSpecialCharacterError:
    "Name doesn't include special character and digit (E.g: !@#$%ˆ&*...) except ' (ex. H'hen Niê)",
  duplicateWordsError: 'No same 3 characters in 1 word'
};

export const validateName = name => {
  let error = null;

  const normalizedName = name.trim().replace(/\s\s+/g, ' ');

  if (normalizedName.length < 2) {
    error = nameErrors.nameLengthError;
  }
  if (normalizedName.length > 50) {
    error = nameErrors.nameMaxLengthError;
  }
  const nameArray = normalizedName.split(' ');

  if (nameArray.length < 2) {
    error = nameErrors.numberOfWordsLengthError;
  }

  nameArray.forEach(element => {
    if (element.length > 10) {
      return (error = nameErrors.maxWordLengthError);
    }
    let word = /^[ A-Za-z0-9'’àáãạảăắằẳẵặâấầẩẫậèéẹẻẽêềếểễệđìíĩỉịòóõọỏôốồổỗộơớờởỡợùúũụủưứừửữựỳỵỷỹýÀÁÃẠẢĂẮẰẲẴẶÂẤẦẨẪẬÈÉẸẺẼÊỀẾỂỄỆĐÌÍĨỈỊÒÓÕỌỎÔỐỒỔỖỘƠỚỜỞỠỢÙÚŨỤỦƯỨỪỬỮỰỲỴỶỸÝ]*$/;
    if (!word.test(element)) {
      return (error = nameErrors.nameSpecialCharacterError);
    }

    word = /([a-z])(?:\1){2}/i;
    if (element.match(word)) {
      return (error = nameErrors.duplicateWordsError);
    }
  });

  return error;
};

const emailErrors = {
  emailLengthError: 'Email must not be blank',
  emailFormatError: 'Email is incorrect format'
};

export const validateEmail = email => {
  const normalizedEmail = normalizeEmail(email);
  const emailRegex = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,})$/;

  if (normalizedEmail.length < 1) {
    return emailErrors.emailLengthError;
  }
  if (!emailRegex.test(normalizedEmail)) {
    return emailErrors.emailFormatError;
  }
  return null;
};

export const normalizeEmail = email => email.replace(' ', '').trim();

const IDErrors = {
  IDLengthError: 'The length of ID must be 9 or 12',
  duplicateSevenCharactersFormatError: 'ID has no 7 same numbers',
  consecutiveCharactersFormatError:
    'ID does not allow above 5 consecutive numbers (ie. 123456)'
};

export const validateID = ID => {
  const normalizedID = normalizeID(ID);
  let error = null;
  if (normalizedID.length < 10) {
    if (normalizedID.length !== 9) {
      error = IDErrors.IDLengthError;
    }
  } else if (normalizedID.length !== 12) {
    error = IDErrors.IDLengthError;
  }

  const IDRegex = /([0-9])(?:.*\1){6}/i;
  if (normalizedID.match(IDRegex)) {
    error = IDErrors.duplicateSevenCharactersFormatError;
  }

  return error;
};

export const normalizeID = ID => ID.replace(' ', '').trim();

const passwordErrors = {
  passwordFormatError: 'Mật khẩu cần bao gồm chữ cái và chữ số',
  passwordLengthError: 'Mật khẩu gồm tối thiểu 8 ký tự'
};

export const validatePassword = password => {
  let error = null;
  const normalizedPassword = normalizePassword(password);

  if (normalizedPassword.length < 8) {
    return (error = passwordErrors.passwordLengthError);
  }

  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

  if (!passwordPattern.test(normalizedPassword)) {
    return (error = passwordErrors.passwordFormatError);
  }
  return error;
};

export const normalizePassword = password => password.replace(' ', '').trim();
export const checkProvider = phoneNumber => {
  const normalizedPhoneNumber = normalizePhoneNumber(phoneNumber);
  const flag = false;
  const arr = Object.keys(carriers);
  for (let i = 0; i < arr.length; i++) {
    if (normalizedPhoneNumber.startsWith(arr[i])) {
      return carriers[arr[i]];
    }
  }
  return null;
};
