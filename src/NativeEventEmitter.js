import React from 'react';
import { Platform, NativeAppEventEmitter, DeviceEventEmitter, AppState } from 'react-native';

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
    this.nextAppState = 'active';
    this.eventNavigate = null;
  }

  componentDidMount() {
    const emitter = Platform.OS === 'android' ? DeviceEventEmitter : NativeAppEventEmitter;
    this.subscription = emitter.addListener('EventNavigate', data => {
      this.eventNavigate = data;
      console.log(data);
      this.checkNavigate();
    });
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = nextAppState => {
    this.nextAppState = nextAppState;
    this.checkNavigate();
  };

  checkNavigate() {
    if (this.nextAppState === 'active') {
      if (this.eventNavigate) {
        const { navigator } = this.props;
        const { type, ...options } = this.eventNavigate;
        navigator[type](options);
        this.eventNavigate = null;
      }
    }
  }

  componentWillUnmount() {
    this.subscription && this.subscription.remove();
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  render() {
    return null;
  }
}
