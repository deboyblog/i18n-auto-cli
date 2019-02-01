const axios = require('axios');
/**
 * 使用 https://sxisa.com 创软俱乐部的接口翻译
 * API： https://tran-api.sxisa.com/?w=word
 * params: {
 *     w: 'hello'
 * }
 */
module.exports = async function (content, target) {
    const createParams = (content) => {
        return {
            url: 'https://tran-api.sxisa.com/',
            type: 'GET',
            params: {
                w: content
            }
        }
    };
    const {data} = await axios(createParams(content, target));
    return data.text;
};
