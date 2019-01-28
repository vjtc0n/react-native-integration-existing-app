import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  NativeAppEventEmitter,
  DeviceEventEmitter
} from 'react-native';
import { wrap } from 'MyNewApp/themes';

import NativeEventEmitter from './NativeEventEmitter';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' + 'Shake or press menu button for dev menu'
});

@wrap
export default class App extends React.Component {
  navigatorLogin = () => {
    const { navigator } = this.props;
    navigator.push({
      screen: 'login',
      title: 'Login'
    });
  };

  navigatorNative = () => {
    const { navigator } = this.props;
    navigator.push({
      native: 'HomeController'
    });
  };

  render() {
    const { navigator } = this.props;

    return (
      <View cls="flx-i aic jcc bg-#F5FCFF">
        <Text cls="tc gray">Welcome to React Native!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>Hello World</Text>
        <Text style={styles.instructions}>{instructions}</Text>

        <TouchableOpacity style={{ height: 50, width: 100 }} onPress={this.navigatorLogin}>
          <Text cls="b black">LOGIN</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ height: 50, width: 100 }} onPress={this.navigatorNative}>
          <Text cls="b black">Native APP</Text>
        </TouchableOpacity>
        <NativeEventEmitter navigator={navigator} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  }
});
