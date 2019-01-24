import { Dimensions, Platform } from 'react-native';


export const mapValue = (object, iteratee) => {
  object = Object(object);
  const result = {};

  Object.keys(object).forEach(key => {
    result[key] = iteratee(object[key], key, object);
  });
  return result;
};

/**
 *
 * @param {object} ref - reference of the conponent
 *
 * The initial watchDog is actually the height of the React tree.
 * Then watchDog will be the flag when we find the wrapped component.
 */
export const getReduxComponentRef = (ref, methodName) => {
  if (!ref) {
    return;
  }
  let element = ref;
  let watchDog = 10;
  while (element._reactInternalFiber && watchDog > 0) {
    if (element[methodName]) {
      return element;
    }
    element =
      element._reactInternalFiber.child &&
      element._reactInternalFiber.child.stateNode;
    watchDog--;
  }
  return;
};

const visaRegEx = /^4[0-9]{12}(?:[0-9]{3})?$/;
const amexpRegEx = /^3[47][0-9]{13}$/;
const jcbRegex = /^(?:2131|1800|35\d{3})\d{11}$/;

/**
 *
 * @param {string} cardValue
 * Don't know why trim() or replace(' ','') not working to remove all spaces,
 * so we use split then concat all strings together
 */
export const getCreditCardIcon = cardValue => {
  const tempArray = cardValue.split(' ');
  let trimText = '';
  tempArray.map(item => (trimText = `${trimText}${item}`));
  if (visaRegEx.test(trimText)) {
    return 'cc-visa';
  }
  if (amexpRegEx.test(trimText)) {
    return 'cc-amex';
  }
  if (jcbRegex.test(trimText)) {
    return 'cc-jcb';
  }
  return 'credit-card';
};

export const formatCreditCard = text => {
  const trimText = text.trim();

  if (amexpRegEx.test(trimText)) {
    const tempVal = trimText.replace(/\s/g, '');
    return (
      tempVal.slice(0, 4).replace(/(.{4})/g, '$1 ') +
      tempVal.slice(4, 10).replace(/(.{6})/g, '$1 ') +
      tempVal.slice(10, 15)
    ).trim();
  }
  return trimText
    .replace(/\s/g, '')
    .replace(/(.{4})/g, '$1 ')
    .trim();
};
export const normalizeMoney = money => money.toString().replace(/[^0-9 ]/g, '');
export const transformMoney = money => {
  const normalizedMoney = normalizeMoney(money);
  const length = normalizedMoney.length;
  if (length <= 3) return normalizedMoney;
  if (length > 3) {
    if (length % 3 === 0) {
      let res = normalizedMoney.substring(0, 3);
      for (let i = 3; i < length; i += 3) {
        res += `.${normalizedMoney.substring(i, i + 3)}`;
      }
      return res;
    } else if (length % 3 === 1) {
      let res = normalizedMoney[0];
      for (let i = 1; i < length; i += 3) {
        res += `.${normalizedMoney.substring(i, i + 3)}`;
      }
      return res;
    }
    let res = normalizedMoney.substring(0, 2);
    for (let i = 2; i < length; i += 3) {
      res += `.${normalizedMoney.substring(i, i + 3)}`;
    }
    return res;
  }
};

export const isIphoneX = () => {
  const dimen = Dimensions.get('window');
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (dimen.height === 812 ||
      dimen.width === 812 ||
      (dimen.height === 896 || dimen.width === 896))
  );
};
export const showProvider = attributes => {
  if (attributes && attributes.length !== 0) {
    const index = attributes.findIndex(
      item =>
        item.transactionAttributeValue === 'VTM' ||
        item.transactionAttributeValue === 'VNP' ||
        item.transactionAttributeValue === 'VMS' ||
        item.transactionAttributeValue === 'GMOBILE' ||
        item.transactionAttributeValue === 'VNM'
    );
    if (index === -1) {
      return null;
    }
    switch (attributes[index].transactionAttributeValue) {
      case 'VTM':
        return 'VIETTEL';
      case 'VNP':
        return 'VINAPHONE';
      case 'VMS':
        return 'MOBIFONE';
      case 'GMOBILE':
        return 'GMOBILE';
      case 'VNM':
        return 'VNMOBILE';
      default:
        break;
    }
  }
  return '';
};
export const normalizeCardNumber = cardNumber =>
  cardNumber.toString().replace(/\s/g, '');
export const formatCardBankNumber = cardNumber => {
  const normalizedCardNumber = normalizeCardNumber(cardNumber);
  if (normalizedCardNumber.length <= 4) return normalizedCardNumber;

  let res = normalizedCardNumber.substring(0, 4);
  for (let i = 4; i < normalizedCardNumber.length; i += 4) {
    res += ` ${normalizedCardNumber.substring(i, i + 4)}`;
  }
  return res;
};

export const capitalizeFirstLetter = s => s[0].toUpperCase() + s.slice(1) ;