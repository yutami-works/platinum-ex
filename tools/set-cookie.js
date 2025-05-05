// モジュール読み込み
const fs = require('node:fs');
const path = require('node:path');
const puppeteer = require('puppeteer');
const dotenv = require('dotenv');

// 環境変数読み込み
dotenv.config();
const url = process.env.PARTNER_URL;

// path定義
const cookiesPath = path.join(__dirname, './data/cookies.json');
const waitMs = 60000;

(async () => {
  const browser = await puppeteer.launch({ headless: false }); // GUI表示あり
  const page = await browser.newPage();
  await page.goto(url);

  // 手動 or 自動でログイン処理を済ませる
  await new Promise(resolve => setTimeout(resolve, waitMs));

  // cookieを保存
  const cookies = await page.cookies();
  fs.writeFileSync(cookiesPath, JSON.stringify(cookies, null, 2));

  await browser.close();
})();