#!/usr/bin/env node
const program = require('commander');
const simplified2traditional = require('../src/simplified2traditional');
const sync = require('../src/sync');
program
    .version(require('../package.json').version)
    .description('自动将目标文件夹中文件的中文转换成置顶的繁体中文')
    .option('-s, --sync', 'Matching different in Chinese and English and synchronous the corresponding key')
    .option('-t, --target <path>', 'target dir')
    .option('-d, --dist <path>', 'output dir')
    .option('-l, --lang', 'target language [zh-TW, zh-HK, en-US]', 'zh-TW', /^(zh-TW|zh-TW|en-US)$/i)
    .action(function () {
        if (program.sync) {
            sync(program.target, program.dist);
        } else {
            simplified2traditional(program.target, program.dist, program.lang, program.sync);
        }
    });
program.parse(process.argv);
