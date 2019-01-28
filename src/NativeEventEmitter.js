import React from 'react';
import { Platform, NativeAppEventEmitter, DeviceEventEmitter } from 'react-native';

/**
 * This component is used for listening "RCCManager.sharedInstance()?.navigate()"
 * from ios NativeView
 */

/**
  * For iOS:
  * RCCManager.sharedInstance()?.navigate(["type": "pop"])
  * RCCManager.sharedInstance()?.navigate(["type": "popTo", "screenId" :"abcdxyz"])
  * RCCManager.sharedInstance()?.navigate(["type": "push", "screen": "login", 
  *                                        "title": "This is Login from React Native", 
  *                                        "passProps": ["aPropFromNative": "red"]])
  * It uses options for navigation the same as react-native-navigation
  */

export default class NativeEventEmitter extends React.PureComponent {
  constructor(props) {
    super(props);
    this.subscription = null;
  }

  componentDidMount() {
    const emitter = Platform.OS === 'android' ? DeviceEventEmitter : NativeAppEventEmitter;
    this.subscription = emitter.addListener('EventNavigate', data => {
      console.log(data);
      const { navigator } = this.props;
      const { type, ...options } = data;
      navigator[type](options);
    });
  }

  componentWillUnmount() {
    this.subscription && this.subscription.remove();
  }

  render() {
    return null;
  }
}
