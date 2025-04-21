const express = require('express');
const router = express.Router();

const axios = require('axios');
const sharp = require('sharp');
const FormData = require('form-data');

const Partner = require('../models/Partner');
const Image = require('../models/Image');

// アップロード関数（fsを使わずbuffer対応）
const uploadBufferToH3zjp = async (buffer, filename = 'upload.jpg') => {
  const formData = new FormData();
  formData.append('files', buffer, { filename });

  const res = await axios.post(process.env.UPLOADER_URL, formData, {
    headers: formData.getHeaders(),
    maxContentLength: Infinity,
    maxBodyLength: Infinity
  });

  console.log(res.data.files[0].url);

  return res.data.files[0].url;
};

// リサイズ
const resizeToAspect = async (inputBuffer) => {
  const targetAspectRatio = 3 / 4; // 目標アスペクト比 (例：3:4)

  // 入力画像のサイズを取得
  const metadata = await sharp(inputBuffer).metadata();
  const { width, height } = metadata;

  const currentAspectRatio = width / height;

  let targetWidth, targetHeight;

  if (currentAspectRatio > targetAspectRatio) {
    // 横長 → 高さを基準に余白を追加
    targetWidth = width;
    targetHeight = Math.round(width / targetAspectRatio);
  } else {
    // 縦長 or 正方形 → 幅を基準に余白を追加
    targetWidth = Math.round(height * targetAspectRatio);
    targetHeight = height;
  }

  // 白背景で余白を追加してサイズ調整
  const outputBuffer = await sharp(inputBuffer)
    .resize(targetWidth, targetHeight, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255 },
    })
    .toBuffer();

  return outputBuffer;
};

// 登録画面
router.get('/', (req, res) => {
  res.render('register');
});

// 登録処理
router.post('/', async (req, res) => {
  const { hash, name, birth, tall, figure, job, from, live, status, rawImages, originalImages, resizeImages } = req.body;

  try {
    // Partner 登録
    const newPartner = new Partner({ hash, name, birth, tall, figure, job, from, live, status });
    await newPartner.save();

    // 画像をまとめて処理
    const processedImages = await Promise.all(rawImages.map(async (raw, i) => {
      const original = originalImages[i];
      const resize = resizeImages[i];

      let originalUrl = original;
      let resizeUrl = resize;

      // original が空なら raw をアップロード
      if (!originalUrl) {
        const { data } = await axios.get(raw, { responseType: 'arraybuffer' });
        originalUrl = await uploadBufferToH3zjp(Buffer.from(data), `original_${i}.jpg`);
      }

      // resize が空なら raw をリサイズ→アップロード
      if (!resizeUrl) {
        const { data } = await axios.get(raw, { responseType: 'arraybuffer' });
        const resizedBuffer = await resizeToAspect(Buffer.from(data));

        resizeUrl = await uploadBufferToH3zjp(resizedBuffer, `resize_${i}.jpg`);
      }

      return { raw, original: originalUrl, resize: resizeUrl };
    }));

    await new Image({ hash, images: processedImages }).save();

    res.redirect('/register'); // 完了後の遷移先
  } catch (error) {
    console.error(error);
    res.status(500).send('登録エラー');
  }
});

module.exports = router;
