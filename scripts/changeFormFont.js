const fs = require('fs');
const fontJson = require('../fonts/selection.json');

function changeFormFont() {
  const newFontObject = {};
  fontJson.icons.map((icon, index) => {
    newFontObject[`${icon.properties.name}`] = icon.properties.code;
  });
  fs.writeFile('fonts/selection.json', JSON.stringify(newFontObject), 'utf8', err => {
    if (err) throw err;
    else console.log('Change Font successfully!');
  });
}

changeFormFont();
