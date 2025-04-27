const express = require('express');
const router = express.Router();

const { checkRawOrgRszImages } = require('../utils/kyo2');

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
    // partnersを全取得
    const partnersBaseData = await Partner.find({});

    // 個別情報加工
    const partners = await Promise.all(
      partnersBaseData.map(async (partner) => {
        // hashを基にimagesデータを取得
        const image = await Image.findOne({ hash: partner.hash });

        // 年齢計算
        let age = '??';
        if (partner.birth) {
          age = calculateAge(partner.birth);
        }
        const headerName = `${partner.name}(${age})`;

        // 状態定義
        let state = '不明';
        if (partner.connect == '2') {
          state = '契約済み';
        } else if (partner.connect == '1') {
          state = '契約準備';
        } else {
          state = '待機中';
        }

        // 追加情報
        if (partner.quit == '2') {
          state = `${state}（解約不可）`;
        } else if (partner.quit == '1') {
          state = `${state}（予約不可）`;
        }

        return {
          ...partner.toObject(),
          headerName: headerName,
          status: state,
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
