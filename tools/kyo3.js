const fs = require('node:fs');
const path = require('node:path');

const cookiesPath = path.join(__dirname, './data/cookies.json');

const updateCookies = (cookies) => {
  fs.writeFileSync(cookiesPath, JSON.stringify(cookies, null, 2));
}




module.exports = { updateCookies };