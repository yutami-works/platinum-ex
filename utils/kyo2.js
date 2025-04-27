const { imageUrl73rror, imageUrl73rror34 } = require('../utils/mirror73');

const checkRawOrgRszImages = async (rawImages, originalImages, resizeImages) => {

  const rawOrgRszImages = [];
  for (let i = 0; i < rawImages.length; i++) {
    let raw = rawImages[i];
    const original = originalImages[i];
    const resize = resizeImages[i];

    let originalUrl = original;
    let resizeUrl = resize;

    // 全ての項目が空欄の登録はスキップ
    if (!raw && !originalUrl && !resizeUrl) {
      continue
    }

    // 最高画質
    if (raw && raw.startsWith('https://prod-pairs-jp-icon-cdn.pairs.lv/')) {
      const [baseUrl] = raw.split('?');
      raw = `${baseUrl}?v=1&width=1280&height=1280`;
    }

    // original が空なら raw をアップロード
    if (!originalUrl) {
      originalUrl = await imageUrl73rror(raw);
    }

    // resize が空なら raw をリサイズ→アップロード
    if (!resizeUrl) {
      resizeUrl = await imageUrl73rror34(raw)
    }

    rawOrgRszImages.push({ raw, original: originalUrl, resize: resizeUrl });
  }

  return rawOrgRszImages;
};

module.exports = { checkRawOrgRszImages };