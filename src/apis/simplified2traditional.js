const axios = require('axios');
/**
 * 使用 https://brushes8.com/zhong-wen-jian-ti-fan-ti-zhuan-huan 网站的接口翻译
 * API： https://brushes8.com/zhong-wen-jian-ti-fan-ti-zhuan-huan
 * params: {
 *     data: 哈哈哈
       variant: zh-tw
       dochineseconversion: 1
       submit: 开始转换 (Ctrl + Enter)
 * }
 */
module.exports = async function (content, target) {
    const matchReg = new RegExp(/<textarea id="response" rows="15" cols="150">([\s\S]*)/);
    const createParams = (content, lang = 'zh-tw') => {
        return {
            url: 'https://brushes8.com/zhong-wen-jian-ti-fan-ti-zhuan-huan',
            type: 'GET',
            params: {
                data: content,
                variant: lang.toLowerCase(),
                dochineseconversion: 1
            }
        }
    };
    const {data} = await axios(createParams(content, target));
    const matchResult = data.match(matchReg);
    const translateResult = (matchResult && matchResult.length > 1) ? matchResult[1] : '';
    return translateResult && translateResult.replace(/\\/g, '');
};
