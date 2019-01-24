export const convertPaymentCardArray = paymentCards => {
  const newCardArray = [];
  for (let i = 1; i < paymentCards.length + 1; i++) {
    const element = paymentCards[i - 1];
    newCardArray.push({
      ...element,
      id: i,
      value: `**** **** **** ${element.bankAccountNumber.slice(-4)}`,
      color: 'gray',
      text: "Card Number (You don't have to fill this if using linked bank)"
    });
  }
  return newCardArray;
};
