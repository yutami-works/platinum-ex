const express = require('express');
const router = express.Router();

const axios = require('axios');
const sharp = require('sharp');
const FormData = require('form-data');

const Partner = require('../models/Partner');
const Image = require('../models/Image');

// 登録画面
router.get('/', (req, res) => {
  res.render('register');
});

// 登録処理
router.post('/', async (req, res) => {
  const { hash, name, tall, figure, job, from, live, status, rawImages, originalImages, resizeImages } = req.body;

  try {
    // Partner 登録
    const newPartner = new Partner({ hash, name, tall, figure, job, from, live, status });
    await newPartner.save();

    // 画像データ整形して Image 登録
    const images = rawImages.map((raw, i) => ({
      raw,
      original: originalImages[i],
      resize: resizeImages[i]
    }));

    const newImage = new Image({ hash, images });
    await newImage.save();

    res.redirect('/register'); // 完了後の遷移先
  } catch (error) {
    console.error(error);
    res.status(500).send('登録エラー');
  }
});

module.exports = router;
