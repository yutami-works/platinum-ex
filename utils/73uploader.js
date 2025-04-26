const axios = require('axios');
const FormData = require('form-data');

const uploadBuffer73 = async (buffer, filename = 'upload.jpg', originalUrl) => {

  let resultUrl;

  const formData = new FormData();
  formData.append('files', buffer, { filename });

  try {
    const res = await axios.post('https://hm-nrm.h3z.jp/uploader/work.php', formData, {
      headers: formData.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });
    resultUrl = res.data.files[0].url;
    console.log(`画像アップロード成功：${resultUrl}`);
  } catch (error) {
    console.warn(`画像アップロード失敗：${error.response.status}`);
    resultUrl = originalUrl;
  }

  return resultUrl;
};

module.exports = { uploadBuffer73 };