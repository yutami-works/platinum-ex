// モジュール読み込み
const puppeteer = require('puppeteer');
const dotenv = require('dotenv');
const { updateCookies } = require('./kyo3');

// 環境変数読み込み
dotenv.config();
const url = process.env.PARTNER_URL;

// 最大タイムアウト
const timeoutMs = 300000;

// 待機要素
const clsMypage = '.css-1ojrg1m';

(async () => {
  const browser = await puppeteer.launch({ headless: false }); // GUI表示あり
  const page = await browser.newPage();
  await page.goto(url);

  // 手動 or 自動でログイン処理を済ませる
  try {
    await page.waitForSelector(clsMypage, { timeout: timeoutMs });
    console.log('ログイン成功');
  } catch (error) {
    console.warn('時間内にログイン処理が成功しませんでした');
  }

  // cookieを保存
  const cookies = await page.cookies();
  updateCookies(cookies);

  await browser.close();
})();