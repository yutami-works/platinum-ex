const axios = require('axios');
const FormData = require('form-data');

const uploaderUrl = process.env.UPLOADER_URL;

const uploadBuffer73 = async (buffer, filename, originalUrl) => {

  let resultUrl;

  const formData = new FormData();
  formData.append('files', buffer, { filename });

  try {
    const res = await axios.post(uploaderUrl, formData, {
      headers: formData.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });
    resultUrl = res.data.files[0].url;
    console.log(`画像アップロード成功：${resultUrl}`);
  } catch (error) {
    const status = error.response?.status || 'No response';
    console.warn(`画像アップロード失敗：${status}`);
    console.warn('画像アップロード失敗詳細:', error.message);
    // 失敗したら元のURLを返却する
    resultUrl = originalUrl;
  }

  return resultUrl;
};

module.exports = { uploadBuffer73 };