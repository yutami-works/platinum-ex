const express = require('express');
const router = express.Router();

const { imageUrl73rror, imageUrl73rror34 } = require('../utils/mirror73');

const Partner = require('../models/Partner');
const Image = require('../models/Image');

// 登録画面
router.get('/', (req, res) => {
  res.render('register');
});

// 登録処理
router.post('/', async (req, res) => {
  const { hash, name, birth, tall, figure, job, from, live, status, rawImages, originalImages, resizeImages } = req.body;

  try {
    // 画像アップロード
    const processedImages = [];
    for (let i = 0; i < rawImages.length; i++) {
      const raw = rawImages[i];
      const original = originalImages[i];
      const resize = resizeImages[i];

      let originalUrl = original;
      let resizeUrl = resize;

      // original が空なら raw をアップロード
      if (!originalUrl) {
        originalUrl = await imageUrl73rror(raw);
      }

      // resize が空なら raw をリサイズ→アップロード
      if (!resizeUrl) {
        resizeUrl = await imageUrl73rror34(raw)
      }

      processedImages.push({ raw, original: originalUrl, resize: resizeUrl });
    }

    console.log('images登録');
    await new Image({ hash, images: processedImages }).save();

    // Partner 登録
    console.log('partners登録');
    const newPartner = new Partner({ hash, name, birth, tall, figure, job, from, live, status });
    await newPartner.save();

    res.redirect('/register'); // 完了後の遷移先
  } catch (error) {
    console.error(error);
    res.status(500).send('登録エラー');
  }
});

module.exports = router;
