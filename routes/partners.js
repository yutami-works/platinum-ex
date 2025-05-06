const express = require('express');
const router = express.Router();

const { checkRawOrgRszImages } = require('../utils/kyo2');
const { printImageUrlSize } = require('../utils/image2');

const Partner = require('../models/Partner');
const Image = require('../models/Image');

const calculateAge = (birthdate) => {
  const today = new Date();
  const birthDate = new Date(birthdate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  // 誕生月・日がまだ来てなければ、年齢を1引く
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
}

/* GET users listing. */
router.get('/', async (req, res) => {
  try {
    // partnersを全取得(like順)
    const partnersBaseData = await Partner.find({}).sort({ like: -1 });;

    // 個別情報加工
    const partners = await Promise.all(
      partnersBaseData.map(async (partner) => {
        // hashを基にimagesデータを取得
        const image = await Image.findOne({ hash: partner.hash });

        if (image.images.length === 0) {
          image.images = [
            {
              raw: '',
              original: '',
              resize: ''
            }
          ];
        }

        // 年齢計算
        let age = '??';
        if (partner.birth) {
          age = calculateAge(partner.birth);
        }
        const headerName = `${partner.name}(${age})`;

        return {
          ...partner.toObject(),
          headerName: headerName,
          images: image.images,
          link: process.env.PARTNER_URL + partner.hash,
          modal: `modal-${partner.hash}`,
          carousel: `carousel-${partner.hash}`
        };
      })
    );

    // データを渡す
    res.render('partners', { partners: partners });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: '取得エラー' });
  }
});

// 編集フォーム表示
router.get('/edit/:hash', async (req, res) => {
  const hash = req.params.hash;
  const partner = await Partner.findOne({ hash });
  const image = await Image.findOne({ hash });

  // debug
  for (const img of image.images) {
    if (img.raw) {
      await printImageUrlSize(img.raw);
    }
    if (img.original) {
      await printImageUrlSize(img.original);
    }
    if (img.resize) {
      await printImageUrlSize(img.resize);
    }
  }

  if (!partner) return res.status(404).send('対象のデータが見つかりません');

  res.render('edit', { partner, image });
});

// 更新処理
router.post('/edit/:hash', async (req, res) => {
  const hash = req.params.hash;

  await Partner.updateOne({ hash }, {
    $set: {
      name: req.body.name,
      birth: req.body.birth,
      tall: req.body.tall,
      figure: req.body.figure,
      job: req.body.job,
      from: req.body.from,
      live: req.body.live,
      connect: req.body.connect,
      quit: req.body.quit
    }
  });

  // Imageの更新（完全置換）
  if (req.body.images && Array.isArray(req.body.images)) {
    const rawImages = req.body.images.map(img => img.raw);
    const originalImages = req.body.images.map(img => img.original);
    const resizeImages = req.body.images.map(img => img.resize);
    const rawOrgRszImages = await checkRawOrgRszImages(rawImages, originalImages, resizeImages);

    await Image.updateOne({ hash }, {
        $set: {
          images: rawOrgRszImages
        }
      },
      { upsert: true }
    );
  }

  res.redirect('/partners'); // 一覧ページなどに戻す
});

// like加算エンドポイント
router.post('/like/:hash', async (req, res) => {
  try {
    const { hash } = req.params;
    await Partner.updateOne({ hash }, { $inc: { like: 1 } });
    res.json({ success: true });
  } catch (error) {
    console.error('Like加算失敗', error);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
