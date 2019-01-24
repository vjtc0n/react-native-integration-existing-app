# react-native-agiletech

## Getting started

`$ npm install react-native-agiletech --save`

### Mostly automatic installation

`$ react-native link react-native-agiletech`

### Manual installation

#### iOS

1.  In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2.  Go to `node_modules` ➜ `react-native-agiletech` and add `RNUtilities.xcodeproj`
3.  In XCode, in the project navigator, select your project. Add `libRNUtilities.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4.  Run your project (`Cmd+R`)<

#### Android

1.  Open up `android/app/src/main/java/[...]/MainActivity.java`

* Add `import vn.agiletech.rnutils.RNUtilitiesPackage;` to the imports at the top of the file
* Add `new RNUtilitiesPackage()` to the list returned by the `getPackages()` method

2.  Append the following lines to `android/settings.gradle`:
    ```
    include ':react-native-agiletech'
    project(':react-native-agiletech').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-agiletech/android')
    ```
3.  Insert the following lines inside the dependencies block in `android/app/build.gradle`:
    ```
      compile project(':react-native-agiletech')
    ```

## Usage

```javascript
import RNUtils from 'react-native-agiletech';

// Share action
RNutils.share({ url, message, subject })
  .then(result => console.log('share', result))
  .catch(e => console.log('err', e));

// static informations:
console.log(RNutils);
{
  appVersion: "1.0",
  buildVersion: 1,
  bundleIdentifier: "vn.agiletech.demo",
  country: "United States",
  countryCode: "US",
  locale: "en",
}
```
