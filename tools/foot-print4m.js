const { fetchIds, footPrint } = require('./req-papi');

const targetNum = process.argv[2];

(async () => {
  const ids = await fetchIds(targetNum);

  for (const id of ids) {
    await footPrint(id);
  }
})();