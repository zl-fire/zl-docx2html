let fs = require('fs'); //文件模块
let marked = require('marked').marked; //md转html模块

/**
 * @function Md2Html
 * @description markdown文件转html页面
 */
class Md2Html {
    md2html(fileName) {
        fileName = fileName || 'unnamed';
        return new Promise((resolve, reject) => {
            fs.readFile(fileName, 'utf-8', (err, data) => { //读取文件
                if (err) {
                    throw err;
                }
                // 同步使用 highlight.js 转换代码
                marked.setOptions({
                    highlight: function (code) {
                        return require('highlight.js').highlightAuto(code).value
                    }
                });
                const content = marked(data); //将md内容转为html内容
                resolve(content)
            });
        })
    }
}
export default Md2Html;

// 使用示例
// let path=require("path");
// await new Md2Html(docxPath).md2html();
