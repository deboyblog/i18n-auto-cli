const simplified2traditional = require('./apis/simplified2traditional');
const listFile = require('./utils/list-file');
const path = require("path");
const fs = require("fs");
const chalk = require('chalk');
const log = console.log;
let mode = 'dir'; // directory file
module.exports = function (target, dist, lang = 'zh-TW') {
    // [{name: '', content: ''}]
    const tasks = [];
    if (!target || typeof target !== 'string') {
        log(chalk.red(`The target option is reqired! use -t you-path to tell me where is the directory you need to translate.`))
        return;
    }
    if (!dist || typeof dist !== 'string') {
        log(chalk.red(`The dist option is reqired! use -d you-path to tell me where is the directory to save the translate result.`))
        return;
    }
    if (!lang || typeof lang !== 'string') {
        log(chalk.red(`The lang option is reqired! use -l you target language to tell me what's the language you want. support: zh-TW zh-HK`))
        return;
    }
    target = path.resolve(process.cwd(), target);
    dist = path.resolve(process.cwd(), dist);
    log(chalk.green(`
Target: ${target}
Dist: ${dist}
Lang: ${lang}
`));
    log(chalk.green('Start to translate...'));
    listFile(target, (file) => {
        // readFileSync got Buffer
        const fileContent = fs.readFileSync(file).toString();
        simplified2traditional(fileContent, lang).then(rst => {
            // output the translate result to file
            const err = fs.writeFileSync(file.replace(target, dist), rst);
            if (!err) {
                log(chalk.green(`File: ${file} translate complete.`))
            }
        });
    });
};
