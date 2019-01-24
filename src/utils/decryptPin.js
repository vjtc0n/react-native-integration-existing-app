import { NativeModules } from 'react-native';

export const decryptPin = (key, encryptedData) =>
  NativeModules.RNUtilities.pinDecrypt(key, encryptedData);
