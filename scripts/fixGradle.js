const fs = require('fs');

const match = process.env.PATH.match(/[^:]+Library\/Android\/sdk/);
if (match) {
  const propertiesFile = 'android/local.properties';
  fs.readFile(propertiesFile, 'utf8', (err, data) => {
    if (err) {
      return console.log(err);
    }
    const result = data.replace(/sdk.dir=.*/g, `sdk.dir=${match[0]}`);
    if (result.length !== data.length) {
      fs.writeFile(propertiesFile, result, 'utf8', err => {
        if (err) return console.log(err);
      });
    }
  });
}

function processGradle() {
  console.log('################################');
  console.log('# Upgrade Android build.gradle #');
  console.log('################################\n');
  if (!fs.existsSync('./node_modules')) {
    console.log('node_modules directory does not exists');
    return;
  }
  const nodeModulePath = './node_modules';
  const dirs = fs.readdirSync(nodeModulePath);
  const subDirs = ['./android/app/build.gradle'];

  const checkAndPush = dir => fs.existsSync(dir) && subDirs.push(dir);
  dirs.forEach(dir => {
    const lookupDirs = [
      'android/build.gradle',
      'ReactAndroid/build.gradle',
      'src/android/build.gradle',
      'lib/android/build.gradle',
      'android/app/build.gradle',
      'android-exoplayer/build.gradle'
    ];
    lookupDirs.forEach(lookupDir =>
      checkAndPush(`${nodeModulePath}/${dir}/${lookupDir}`)
    );
  });
  subDirs.forEach(gradle => {
    const content = fs.readFileSync(gradle).toString();
    const replacedContent = content
      .replace(/compile(?=[\s\t\n\(])/g, 'implementation')
      .replace(
        /(androidTest|test|debug)(?:Api|Compile)(?=[\s\t\n])/g,
        '$1Implementation'
      )
      .replace(/provided(?=[\s\t\n])/g, 'compileOnly');
    if (gradle === './node_modules/react-native-fbsdk/android/build.gradle') {
      const replacedFBSDK = content.replace(
        'com.facebook.android:facebook-android-sdk:4.+',
        'com.facebook.android:facebook-android-sdk:4.37.0'
      );
      fs.writeFileSync(gradle, replacedFBSDK);
    }

    if (content.length !== replacedContent.length) {
      fs.writeFileSync(gradle, replacedContent);
      console.log(`Processed file: ${gradle}`);
    }
  });
}

processGradle();
