import { PermissionsAndroid, Platform, Alert } from 'react-native';
import Contacts from 'react-native-contacts';

export const getContacts = async () => {
  let dataList = [];
  try {
    if (Platform.OS === 'android') {
      const granted = await getAndroidPermission();
      if (!granted) {
        return dataList;
      }
    }

    dataList = await getContactList();
    return dataList;
  } catch (error) {
    return dataList;
  }
};

const getAndroidPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
      title: 'Zota App Contacts Permission',
      message: 'Zota App needs to access to your contacts'
    });
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      Alert.alert('Thông báo', 'Truy cập danh bạ bị từ chối');
      return false;
    }
    return true;
  } catch (err) {
    Alert.alert('Thông báo', 'Truy cập danh bạ bị từ chối');
    return false;
  }
};

const getContactList = async () => {
  const dataList = [];
  try {
    return await new Promise(resolve => {
      Contacts.getAll((err, contacts) => {
        if (err) {
          Alert.alert('Thông báo', 'Không cho phép đồng bộ danh bạ');
          return resolve(dataList);
        }

        contacts.forEach(element => {
          const contact = {};
          let name = '';
          if (element.givenName) {
            name += element.givenName;
          }
          if (element.familyName) {
            name += ` ${element.familyName}`;
          }
          contact.name = name.trim();
          const phoneNumbers = [];
          element.phoneNumbers.forEach(phoneElement => {
            if (phoneElement.label === 'mobile') {
              const phoneNumber = phoneElement.number
                ? phoneElement.number.replace(/[^0-9]/g, '')
                : '';
              phoneNumbers.push(phoneNumber);
            }
          });
          if (phoneNumbers.length !== 0) {
            contact.phoneNumbers = phoneNumbers;
            dataList.push(contact);
          }
        });
        resolve(dataList);
      });
    });
  } catch (err) {
    return dataList;
  }
};
