export const formatTransactionName = serviceName => {
  let transactionName = serviceName;

  switch (serviceName) {
    case 'FUND_IN':
      transactionName = 'Nạp tiền';
      break;
    case 'FUND_OUT':
      transactionName = 'Rút tiền';
      break;
    case 'WALLET_TRANSFER':
      transactionName = 'Chuyển tiền';
      break;
    case 'EPIN':
      transactionName = 'Mua mã thẻ';
      break;
    case 'PHONE_TOPUP':
      transactionName = 'Điện thoại trả trước';
      break;

    default:
      break;
  }
  return transactionName;
};
