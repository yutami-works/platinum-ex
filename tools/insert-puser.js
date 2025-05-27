const dotenv = require('dotenv');
dotenv.config();
require('../utils/db');
const Partner = require('../models/Partner');

const { getUserInfo, getSimilarUserInfo } = require('./req-papi');
const { data2json } = require('./kyo3');

const hash = process.argv[2];

(async () => {
  console.log('api');
  const userInfo = await getUserInfo(hash);
  console.log('id：', userInfo.id);
  console.log('user_id：', userInfo.user_id);
  console.log('age：', userInfo.age);
  console.log('nickname：', userInfo.nickname);
  console.log('height：', userInfo.height);
  console.log('residence_state：', userInfo.residence_state);
  console.log('home_state：', userInfo.home_state);
  console.log('job：', userInfo.job);
  console.log('body_build：', userInfo.body_build);
  console.log('blood_type：', userInfo.blood_type);
  console.log('horoscope：', userInfo.horoscope);
  console.log('account_status：', userInfo.account_status);
  console.log('got_like：', userInfo.got_like);
  console.log('since_last_login_seconds：', userInfo.since_last_login_seconds);
  console.log('created_at：', userInfo.created_at);
  console.log('like_from_me：', userInfo.states.like_from_me); // 1:on 2:none
  console.log('match：', userInfo.states.match); // 1:match 2:none
  console.log('private_mode：', userInfo.states.private_mode);
  console.log('is_banned：', userInfo.states.is_banned);
  console.log('ignore_like_from_me_status：', userInfo.states.ignore_like_from_me_status);
  for (const img of userInfo.images ) {
    console.log(img.url);
  }

  const getBirth = (age) => {
    const today = new Date();
    const birthYear = today.getFullYear() - age;
    const birth = new Date(birthYear, today.getMonth(), today.getDate());
    return birth;
  }

  const partner = await Partner.findOne({ hash });
  if (partner) {
    console.log('そのユーザーは既に登録されています');
    //console.log(partner);
  } else {
    console.log('新規登録');
    try {
      const newPartner = new Partner({
        hash: hash,
        partnerNumber: userInfo.user_id,
        join: new Date(userInfo.created_at),
        name: userInfo.nickname,
        birth: getBirth(userInfo.age),
        height: userInfo.height,
        figure: userInfo.body_build,
        job: userInfo.job,
        from: userInfo.home_state,
        live: userInfo.residence_state,
        blood: userInfo.blood_type,
        horoscope: userInfo.horoscope,
        quit: userInfo.account_status == '2',
        private: userInfo.states.private_mode == '1',
        negotiate: userInfo.account_status == '2',
        connect: userInfo.states.match == '1',
        like: 0,
        images: userInfo.images?.map(img => ({
          raw: img.url + '&width=1280&height=1280',
          original: img.url + '&width=1280&height=1280',
          resize: img.url + '&width=1280&height=1280',
          display: false
        })) || []
      });
      await newPartner.save();
      console.log('登録完了');
    } catch (error) {
      console.log(error);
    }
  }
})();