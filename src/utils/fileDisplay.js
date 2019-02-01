const fs = require('fs');
const path = require('path');
/**
 * 文件遍历方法
 * @param filePath 需要遍历的文件路径
 * @param fileCallback 返回遍历出来的文件列表
 */
module.exports = function fileDisplay(filePath, fileCallback) {
    fs.stat(filePath, (err, stat) => {
        if (err) {
            console.warn('获取文件stat失败');
            return;
        }
        const isFile = stat.isFile();//是文件
        const isDir = stat.isDirectory();//是文件夹
        if (isFile) {
            fileCallback(filePath)
        }
        if (isDir) {
            fs.readdir(filePath, function (err, files) {
                if (err) {
                    console.warn('read dir error', err)
                } else {
                    //遍历读取到的文件列表
                    files.forEach((filename) => {
                        //获取当前文件的绝对路径
                        const filedir = path.join(filePath, filename);
                        fileDisplay(filedir, fileCallback);
                    });
                }
            });
        }
    });
};
