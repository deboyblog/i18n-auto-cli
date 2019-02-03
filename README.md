# i18n-auto-cli

Translate simplified Chinese to traditional Chinese (HK TW) and English(on work)
In order to project automatically internationalization;

> Thanks to

[在线“智能”中文简体繁体正体转换工具](https://brushes8.com/zhong-wen-jian-ti-fan-ti-zhuan-huan)
[创智俱乐部](https://sxisa.com)

## Installation

> npm
```$xslt
npm i -g i18n-auto-cli
```

> yarn
```#$xslt
yarn global add i18n-auto-cli
```

## Usage

> simplified2traditional

```$xslt
i18n-auto -t you-path-to-untranlsate-dir-or-file -d you-path-to-outdir-or-file -l you-target-language[zh-HK|zh-TW]
```

> Sync the key

```$xslt
i18n-auto -s -t you-path-or-dir -d you-path-or-dir;
```

## Demo

> Single file

`./zh.json`

```$xslt
// to zh-TW
i18n-auto -t ./zh.json -d ./tw.json -l zh-TW

// to zh-HK
i18n-auto -t ./zh.json -d ./hk.json -l zh-HK
```

> Directory (recursive)

`./zh-CN`

```$xslt
i18n-auto -t ./zh-CN -d ./zh-TW -l zh-TW
// ...etc
```
> No English translation function yet; I need a free translate API;

## Roadmap

- [x] Matching different in Chinese and English and synchronous the corresponding key;
- [] zh-CN to en-US;

**PR welcome.**

