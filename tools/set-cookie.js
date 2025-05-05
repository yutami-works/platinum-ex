// モジュール読み込み
const puppeteer = require('puppeteer');
const dotenv = require('dotenv');
const { updateCookies } = require('./kyo3');

// 環境変数読み込み
dotenv.config();
const url = process.env.PARTNER_URL;

// path定義
const waitMs = 60000;

(async () => {
  const browser = await puppeteer.launch({ headless: false }); // GUI表示あり
  const page = await browser.newPage();
  await page.goto(url);

  // 手動 or 自動でログイン処理を済ませる
  await new Promise(resolve => setTimeout(resolve, waitMs));

  // cookieを保存
  const cookies = await page.cookies();
  updateCookies(cookies);

  await browser.close();
})();