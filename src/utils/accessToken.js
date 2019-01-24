import moment from 'moment';

export const getExpireDate = (expireTime, reservedTime = 30) => {
  const expectedTime = moment().add(expireTime - reservedTime, 'seconds');
  return expectedTime.unix();
};

export const checkExpire = (expectedTime, reservedTime = 30) => {
  const currentTimeUnix = moment().unix();
  const timeLeft = expectedTime - currentTimeUnix;
  if (timeLeft < reservedTime) {
    return {
      isExpire: true,
      timeLeft
    };
  }
  return {
    isExpire: false,
    timeLeft
  };
};
