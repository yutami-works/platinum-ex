// モジュール読み込み
const axios = require('axios');
const dotenv = require('dotenv');
const { readCookies } = require('./kyo3');

// 環境変数読み込み
dotenv.config();
const MyPid = process.env.MY_PID;
const EpPrfr = process.env.EP_PRFFR;
const EpPvstr = process.env.EP_PVSTR;
const EpPsrch = process.env.EP_PSRCH;
const EpPusr = process.env.EP_PUSR;
const EpPsmlr = process.env.EP_PSMLR;

// Cookieから情報を抽出する関数
const getCookieValue = (name, cookies) => {
  const found = cookies.find(c => c.name === name);
  return found ? found.value : '';
}

// リクエスト用ヘッダーを生成する関数
const createHeaders = () => {
  // Cookieファイルを読み込む
  const cookies = readCookies();

  // Cookieをヘッダー用文字列に整形
  const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');

  // 固定ヘッダー情報（cookieから抽出する必要があるものは手動でも可）
  const headers = {
    'sec-ch-ua-platform': '"Windows"',
    referer: EpPrfr,
    'accept-language': 'ja',
    'sec-ch-ua': '"Not.A/Brand";v="99", "Chromium";v="136"',
    'sec-ch-ua-mobile': '?0',
    'x-pairs-user-id': MyPid,
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
    accept: 'application/json, text/plain, */*',
    'x-client-version': 'git-xxxxxxxx-v20190101123456',
    'content-type': 'application/json',
    'x-client-device': 'pc',
    Cookie: cookieHeader,
  };

  // 各種必要な値をCookieから抽出してセット
  headers['x-client-session'] = getCookieValue('client_session', cookies);
  headers['pairs-token'] = getCookieValue('pairs_token', cookies);

  return headers;
}

// ヘッダー定義
const headers = createHeaders();

// GET解析用
const getTest = async (url, headers) => {
  let res;
  try {
    res = await axios.get(url, { headers });
    console.log(res.data);
  } catch (error) {
    console.error(`Failed to get user info:`, error.message);
  }

  return res.data;
}

// IDからユーザー情報をGET
const getUserInfo = async (id, headers) => {
  let res;
  const url = EpPusr + id;
  try {
    res = await axios.get(url, { headers });
    console.log(res.data);
  } catch (error) {
    console.error(`Failed to get user info:`, error.message);
  }
  return res.data;
}

// IDから似ているユーザー情報をGET
const getSimilarUserInfo = async (id, headers) => {
  let res;
  const url = EpPsmlr + id;
  try {
    res = await axios.get(url, { headers });
    console.log(res.data);
  } catch (error) {
    console.error(`Failed to get user info:`, error.message);
  }
  return res.data;
}

// 検索からIDをGET
const fetchIds = async (cursorEnd) => {
  const ids = [];
  const cursorStart = 0;
  const addNext = 100;

  for (let cursor = cursorStart; cursor <= cursorEnd; cursor += addNext) {
    const url = `${EpPsrch}?limit=${addNext}&sort=1${cursor > cursorStart ? `&cursor=${cursor}` : ''}`;
    try {
      const res = await axios.get(url, { headers });
      const data = res.data?.data ?? [];
      const pageIds = data.map(item => item?.partner?.id).filter(Boolean);
      ids.push(...pageIds);
      console.log(`Fetched ${pageIds.length} IDs from cursor ${cursor}`);
    } catch (error) {
      console.error(`Failed to fetch at cursor ${cursor}:`, error.message);
    }
  }

  return ids;
}

// 足跡POST
const footPrint = async (id) => {
  const url = EpPvstr + id;
  const postData = {
    source: 'search_normal::personal',
    visitor_context: { type: 'active' }
  };

  try {
    const res = await axios.post(url, postData, { headers });
    await new Promise(resolve => setTimeout(resolve, 400)); // 速過ぎると足跡がつかない気がする
    console.log(`Foot Print ${id}:`, res.status, res.data.created_at);
  } catch (error) {
    console.error(`Failed Foot Print ${id}:`, error.response?.status || error.message);
  }
}

module.exports = { fetchIds, footPrint };