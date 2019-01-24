import { AppRegistry } from 'react-native';

import { Navigation} from 'react-native-navigation';
import Route from './src/route'

export const registerComponent = (key, component) =>
  Navigation.registerComponent(key, component);
for (const key in Route) {
  registerComponent(key, () => Route[key]);
}

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
