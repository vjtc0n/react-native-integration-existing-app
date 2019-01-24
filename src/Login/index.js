import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { wrap } from 'MyNewApp/themes';
@wrap

export default class Login extends Component{
  render() {
    return (
      <View cls="aic jcc bg-#F5FCFF">
        <Text cls="tc black f4">To get started, edit App.js</Text>
        <Text cls="primary">Hello World</Text>
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
