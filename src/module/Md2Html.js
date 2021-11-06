/**
 * markdown文件转html页面
 * @constructor
 */
class Md2Html {
    constructor(fileName) {
        this.fs = require('fs'); //文件模块
        this.path = require('path'); //路径模块
        this.marked = require('marked').marked; //md转html模块
        this.fileName = fileName || 'unnamed';
    }

    /**
    * 将marked转换为html
    */
    md2html() {
       return new Promise((resolve,reject)=>{
            this.fs.readFile(this.fileName, 'utf-8', (err, data) => { //读取文件
                if (err) {
                    throw err;
                }
                // 同步使用 highlight.js 转换代码
                this.marked.setOptions({
                    highlight: function (code) {
                        return require('highlight.js').highlightAuto(code).value
                    }
                });
                const content = this.marked(data); //将md内容转为html内容
                resolve(content)
            });
        })
    }
}
export default Md2Html;

// 使用示例
// let path=require("path");
// await new Md2Html(docxPath).md2html();
