const { imageUrl73rror, imageUrl73rror34 } = require('../utils/mirror73');

const checkRawOrgRszImages = async (rawImages, originalImages, resizeImages) => {

  const rawOrgRszImages = [];
  for (let i = 0; i < rawImages.length; i++) {
    const raw = rawImages[i];
    const original = originalImages[i];
    const resize = resizeImages[i];

    let originalUrl = original;
    let resizeUrl = resize;

    // 全ての項目が空欄の登録はスキップ
    if (!raw && !originalUrl && !resizeUrl) {
      continue
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