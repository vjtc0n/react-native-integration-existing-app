import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { wrap } from 'MyNewApp/themes';
@wrap
export default class Login extends Component {
  render() {
    return (
      <View cls="flx-i aic jcc bg-#F5FCFF">
        <Text cls="tc black f4">To get started, edit App.js</Text>
        <Text cls="primary">Hello World</Text>
        {this.props.aPropFromNative ? (
          <View>
            <Text cls="primary mt4">This is a props from Native Controller (Native View)</Text>
            <Text cls="primary">{this.props.aPropFromNative}</Text>
          </View>
        ) : null}
      </View>
    );
  }
}
