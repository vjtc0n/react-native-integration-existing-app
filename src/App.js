/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
const { NativeEventEmitter, NativeModules } = require('react-native');
const RCCManager = NativeModules.RCCManager;
import { Platform, StyleSheet, Text, View, TouchableOpacity, BackHandler } from 'react-native';
import { wrap } from 'MyNewApp/themes';

const managerEmitter = new NativeEventEmitter(RCCManager);

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' + 'Shake or press menu button for dev menu'
});

@wrap
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.subscription = managerEmitter.addListener('EventNavigate', data => {
      const { navigator } = this.props;
      const { type, ...options } = data;
      navigator[type](options);
    });
  }

  componentWillUnmount() {
    this.subscription.remove();
  }

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
