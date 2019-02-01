#!/usr/bin/env node
const program = require('commander');
const i18nAuto = require('../src/index');
program
    .version(require('../package.json').version)
    .description('自动将目标文件夹中文件的中文转换成置顶的繁体中文')
    .option('-t, --target <path>', 'target dir')
    .option('-d, --dist <path>', 'output dir')
    .option('-l, --lang', 'target language [zh-TW, zh-HK]', 'zh-TW', /^(zh-TW|zh-TW)$/i)
    .action(function () {
        i18nAuto(program.target, program.dist, program.lang);
    });
program.parse(process.argv);
