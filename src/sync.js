const path = require("path");
const fs = require("fs");
const chalk = require('chalk');
var requireFromString = require('require-from-string');
const listFile = require('./utils/list-file');
const log = console.log;
let mode = 'dir'; // directory file
const isJSONFile = function(filename) {
    const names = filename.split('.')
    return names[names.length - 1].toLowerCase() === 'json';
}
/**
 * Matching different in Chinese and English and synchronous the corresponding key
 * get file content 
 * accounding the file type get object var
 * sync the key
 * replace the file content
 */
module.exports = function (target, dist) {
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
    target = path.resolve(process.cwd(), target);
    dist = path.resolve(process.cwd(), dist);
    log(chalk.green(`
Mode: sync
Target: ${target}
Dist: ${dist}
`));
    log(chalk.green('Start to sync...'));
    listFile(target, (file) => {
        // readFileSync default got Buffer
        const fileContent = fs.readFileSync(file).toString();
        // to object
        let tObj = {};
        if (isJSONFile(file)) {
            tObj = JSON.parse(fileContent);
        } else {
            if (/module\.export/.test(fileContent)) {
                tObj = requireFromString(fileContent);
            } else if (/export default/.test(fileContent)) {
                // console.log(fileContent);
                tObj = eval('(' + fileContent.replace(/export default/, '').replace(';', '') + ')');
            }
        }
        // each the key and sync the diff form target lang
        // TODO
    });
};
