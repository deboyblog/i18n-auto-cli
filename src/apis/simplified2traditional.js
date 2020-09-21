const axios = require('axios');
const qs = require('qs');
const unescapeJs =  require('unescape-js');
/**
 * 使用 https://brushes8.com/zhong-wen-jian-ti-fan-ti-zhuan-huan 网站的接口翻译
 * API： https://brushes8.com/zhong-wen-jian-ti-fan-ti-zhuan-huan
 * data: {
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
            method: 'POST',
            data: qs.stringify({
                data: content,
                variant: lang.toLowerCase(),
                dochineseconversion: 1
            }),
            headers: { 
                'content-type': 'application/x-www-form-urlencoded'
             }
        }
    };
    const {data} = await axios(createParams(content, target));
    const matchResult = data.match(matchReg);
    const translateResult = (matchResult && matchResult.length > 1) ? matchResult[1] : '';
    return unescapeJs(translateResult);
};
