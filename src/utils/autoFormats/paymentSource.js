import { transformMoney } from 'Zota/src/utils/index';

export const formatPaymentSourceSubText = value => {
  let subText = '';
  switch (value.id) {
    case 1:
      subText = transformMoney(value.subValue);
      break;
    case 2:
      subText = value.subValue;
      break;
    default:
      subText = `**** ${value.subValue.slice(-4)}`;
      break;
  }

  return subText;
};

export const formatCardBankPayment = (bank, idCard) => {
  const card = {
    id: idCard || 3,
    ...bank,
    value: bank.bankDisplayName,
    subValue: bank.bankAccountNumber
  };
  return card;
};
