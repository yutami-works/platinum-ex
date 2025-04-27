const express = require('express');
const router = express.Router();

const { checkRawOrgRszImages } = require('../utils/kyo2');

const Partner = require('../models/Partner');
const Image = require('../models/Image');

// 登録画面
router.get('/', (req, res) => {
  res.render('register');
});

// 登録処理
router.post('/', async (req, res) => {
  // 入力データ
  const { hash, name, birth, tall, figure, job, from, live, connect, quit, rawImages, originalImages, resizeImages } = req.body;
  const like = 0;

  try {
    // 画像アップロード
    const rawOrgRszImages = await checkRawOrgRszImages(rawImages, originalImages, resizeImages);

    console.log('images登録');
    await new Image({ hash, images: rawOrgRszImages }).save();

    // Partner 登録
    console.log('partners登録');
    const newPartner = new Partner({ hash, name, birth, tall, figure, job, from, live, connect, quit, like});
    await newPartner.save();

    res.redirect('/register'); // 完了後の遷移先
  } catch (error) {
    console.error(error);
    res.status(500).send('登録エラー');
  }
});

module.exports = router;
