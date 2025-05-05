const { getUserInfo, getSimilarUserInfo } = require('./req-papi');
const { data2json } = require('./kyo3');

const targetId = process.argv[2];
const fnInfo = targetId + '-userinfo.json';
const fnSimilar = targetId + '-similar.json';

(async () => {
  const resInfo = await getUserInfo(targetId);
  data2json(resInfo, fnInfo);
  const resSimilar = await getSimilarUserInfo(targetId);
  data2json(resSimilar, fnSimilar);
})();