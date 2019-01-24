import { AppRegistry } from 'react-native';
import { Navigation } from 'react-native-navigation';

import Route from './src/route';
import { buildTheme } from './src/config-theme';

export const registerComponent = (key, component) => Navigation.registerComponent(key, component);
for (const key in Route) {
  registerComponent(key, () => Route[key]);
}

buildTheme();
Navigation.startSingleScreenApp({
  screen: {
    screen: 'app',
    navigatorStyle: {
      navBarHidden: true
    }
  },
  appStyle: {
    hideBackButtonTitle: true,
    orientation: 'portrait'
  }
});

// AppRegistry.registerComponent('MyNewApp', () => App);
