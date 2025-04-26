const { imageUrl2buffer, paddingImage34 } = require('./image2');
const { uploadBuffer73 } = require('./73uploader');

// 画像URLのミラーを生成
const imageUrl73rror = async (imageUrl) => {
  const imageBuffer = await imageUrl2buffer(imageUrl);
  const resultUrl = await uploadBuffer73(imageBuffer, 'mirror-original.jpg', imageUrl);
  return resultUrl;
};

// 画像URLのミラーを生成（アスペクト比3:4）
const imageUrl73rror34 = async (imageUrl) => {
  const imageBuffer = await imageUrl2buffer(imageUrl);
  const imageBuffer34 = await paddingImage34(imageBuffer);
  const resultUrl = await uploadBuffer73(imageBuffer34, 'mirror-resized.jpg', imageUrl);
  return resultUrl;
};

module.exports = { imageUrl73rror, imageUrl73rror34 };
