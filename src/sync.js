const path = require("path");
const fs = require("fs");
const chalk = require('chalk');
var requireFromString = require('require-from-string');
const listFile = require('./utils/list-file');
const log = console.log;
const isJSONFile = function (filename) {
    const names = filename.split('.')
    return names[names.length - 1].toLowerCase() === 'json';
};
const getDeepKeys = function (obj) {
    var keys = [];
    for (var key in obj) {
        keys.push(key);
        if (typeof obj[key] === "object") {
            var subkeys = getDeepKeys(obj[key]);
            keys = keys.concat(subkeys.map(function (subkey) {
                return key + "." + subkey;
            }));
        }
    }
    return keys;
};
const fileContent2Obj = function (filename, fileContent) {
    let obj = null;
    if (isJSONFile(filename)) {
        obj = JSON.parse(fileContent);
    } else {
        if (/module\.exports/.test(fileContent)) {
            obj = requireFromString(fileContent);
        } else if (/export default/.test(fileContent)) {
            console.log(fileContent);
            obj = eval('(' + fileContent.replace(/export default/, '').replace(/};/, '}') + ')');
        }
    }
    return obj;
};
const restoreFileFormat = function (filename, sourceFileContent, fileContent) {
    let content = JSON.stringify(fileContent, null, 4);
    if (!isJSONFile(filename)) {
        if (/module\.exports/.test(sourceFileContent)) {
            content = 'module.exports = ' + content;
        } else if (/export default/.test(sourceFileContent)) {
            // console.log(fileContent);
            content = 'export default ' + content + ';';
        }
    }
    return content;
}
const syncFile = function (filename, content) {
    fs.writeFileSync(filename, content);
    log(chalk.green(`Dist file not exist, ${filename} create successful.`));
};
/**
 * get diff of obj keys
 * @param {*} sourceObj 
 * @param {*} targetObj 
 * return {del: [], add: []};
 */
const getDiffKeys = function (sourceObj, targetObj) {
    // each the key and sync the diff form target lang
    const sourceKeys = getDeepKeys(sourceObj);
    const targetKeys = getDeepKeys(targetObj);
    const addKeys = [];
    const delKeys = [];
    // get the add keys
    sourceKeys.forEach(function (key) {
        if (!targetKeys.includes(key)) {
            addKeys.push(key)
        }
    });
    targetKeys.forEach(function (key) {
        if (!sourceKeys.includes(key)) {
            delKeys.push(key);
        }
    });
    return {
        del: delKeys,
        add: addKeys
    };
};
const getPaths = function (path) {
    return path.split('.').map(p => `['${p}']`).join('');
}
/**
 * return the value through search path of the object
 * @param {*} obj 
 * @param {*} path 
 */
const getValByPath = function (obj, path) {
    const paths = path.split('.')
    let current = obj;
    for (let i = 0; i < paths.length; ++i) {
        if (current[paths[i]] === undefined) {
            return undefined;
        } else {
            current = current[paths[i]];
        }
    }
    return current;
}
const setValByPath = function (obj, path, value) {
    const paths = getPaths(path);
    eval('(obj' + paths + ') = value');
    return obj;
}
const delValByPath = function (obj, path) {
    const paths = getPaths(path);
    eval('(delete obj' + paths + ')');
    return obj;
}
/**
 * Matching different in Chinese and English and synchronous the corresponding key
 * get file content 
 * accounding the file type get object var
 * sync the key
 * replace the file content
 */
module.exports = function (target, dist, ignore) {
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
        if (ignore && new RegExp(ignore).test(file)) {
            log(chalk.yellow(`File: ${file} was ignore.`))
            return;
        }
        // get dist file path
        const distFile = file.replace(target, dist);
        // readFileSync default got Buffer
        const fileContent = fs.readFileSync(file).toString();
        // to object
        let tObj = fileContent2Obj(file, fileContent);
        try {
            if (fs.existsSync(distFile)) {
                const dFileContent = fs.readFileSync(distFile).toString();
                let dObj = fileContent2Obj(distFile, dFileContent);
                // compare the diffrent key and fill or delete the key according to target version (tObj)
                const diffKeys = getDiffKeys(tObj, dObj) || [];
                if (diffKeys.add.length || diffKeys.del.length) {
                    diffKeys.add.forEach(key => {
                        const val = getValByPath(tObj, key);
                        setValByPath(dObj, key, val);
                    });
                    diffKeys.del.forEach(key => {
                        const val = getValByPath(tObj, key);
                        delValByPath(dObj, key, val);
                    });
                    const distFileContent = restoreFileFormat(distFile, dFileContent, dObj);
                    fs.writeFileSync(distFile, distFileContent)
                    log(chalk.green(`File: ${file} Synchronization is complete!`));
                } else {
                    log(chalk.yellow(`Keys of File: ${file} is same as ${distFile} don't need to be sync!`))
                }
            } else {
                syncFile(distFile, fileContent)
            }
        } catch (err) {
            log(chalk.red(err));
        }
    });
};
