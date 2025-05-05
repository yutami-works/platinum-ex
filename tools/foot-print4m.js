const { fetchIds, footPrint } = require('./req-papi');

(async () => {
  const ids = await fetchIds(9000);

  for (const id of ids) {
    await footPrint(id);
  }
})();