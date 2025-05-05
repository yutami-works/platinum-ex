const fs = require('node:fs');
const path = require('node:path');

const dataDirPath = './data/';
const cookiesPath = path.join(__dirname, `${dataDirPath}cookies.json`);

const updateCookies = (cookies) => {
  fs.writeFileSync(cookiesPath, JSON.stringify(cookies, null, 2));
}

const readCookies = () => {
  const cookies = JSON.parse(fs.readFileSync(cookiesPath, 'utf-8'));
  return cookies;
}

const data2json = (data, filename) => {
  const outputPath = path.join(__dirname, dataDirPath + filename);
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`出力しました：${outputPath}`);
}

module.exports = { updateCookies, readCookies, data2json };