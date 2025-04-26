const axios = require('axios');
const sharp = require('sharp');

// 画像URLをBuffer化
const imageUrl2buffer = async (url) => {
  const { data } = await axios.get(url, { responseType: 'arraybuffer' });
  return Buffer.from(data);
};

// アスペクト比調整 (3:4)
const paddingImage34 = async (inputBuffer) => {
  const AspectRatio34 = 3 / 4;

  // inputの縦横比率取得
  const metadata = await sharp(inputBuffer).metadata();
  const { width, height } = metadata;
  const inputAspectRatio = width / height;

  // outputの縦横を算出
  let outputWidth, outputHeight;
  if (inputAspectRatio > AspectRatio34) {
    outputWidth = width;
    outputHeight = Math.round(width / AspectRatio34);
  } else {
    outputWidth = Math.round(height * AspectRatio34);
    outputHeight = height;
  }

  // 余白を白塗り
  const outputBuffer = await sharp(inputBuffer)
    .resize(outputWidth, outputHeight, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255 },
    })
    .toBuffer();

  return outputBuffer;
};

module.exports = { imageUrl2buffer, paddingImage34 };
