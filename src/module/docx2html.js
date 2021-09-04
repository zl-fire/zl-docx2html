let mammoth = require("mammoth");
var path = require("path");
import addMenu2Page from "./addMenu2Page";
let zl_nodefs = require("zl-nodefs");
let {
    writeFile, //创建/写入文件
} = zl_nodefs;

/**
    * @function  传入docx类型文档，会解析成html，同时给这个html注入菜单，最后写入指定的路径
    * @description 这是个异步函数，因为调用转换docx的内置模块时是异步的
    * @param {Object} parObj 完整的参数对象信息
    * @param {String} parObj.docxPath 要处理的docx文档路径
    * @param {String} parObj.outPath 要输出的html文档路径，默认为当前docx文件所在目录
    * @param {Boolean} parObj.isAddHtmlHead  是否给转换后的文档添加html,body等标签
    * @param {Boolean} parObj.isAddMenu   是否给转换后的html文件注入锚点菜单
    * @param {Boolean} parObj.autoHsSty   是否添加手动注入的h1--h6的大小样式
    * @param {Boolean} parObj.isAddOrder   是否添加手动生成的序号
    * @param {Boolean} parObj.isAddpagePadV   是否给页面注入默认的padding值
    * @param {Boolean} parObj.manualAssignment   用户手动注入的样式对象
    * @param {Boolean} parObj.showWarnMessage   是否显示docx文档转换为html时的警告信息（如果有的话），默认显示
    * @param {Boolean} parObj.showExeResult   创建html文件时，是否要显示提示信息
    * @author zl-fire 2021/09/01
    * @example
    * var path = require("path");
    * let { docx2html } = require("zl-docx2html");
    * let fileName = "666.docx";
    * let docxPath = path.join(path.resolve("."), fileName); //通过path.join可以解决mac和window路径规则不一致的情况
    * let outPath = path.join(path.resolve("."), "/aa/bb/cc/dd/", fileName.split(".")[0]+".html");
    * (async function () {
    *     await docx2html({
    *         docxPath: docxPath,
    *         outPath: outPath,
    *         showWarnMessage: false,
    *     })
    * })()
  */
async function docx2html(parObj) {
    // 获取文件名字和后缀
    let basename = path.basename(parObj.docxPath);
    let extname = path.extname(parObj.docxPath);
    let {
        docxPath,
        outPath,
        isAddHtmlHead = true,
        isAddMenu = true,
        showWarnMessage = true,
        showExeResult = true,
        autoHsSty = true,
        isAddOrder = true,
        isAddpagePadV = true,
        manualAssignment
    } = parObj;
    // 给输出路径添加默认值
    if (!outPath) outPath = docxPath.replace(extname, ".html");
    // 不含后缀的名字
    let fileName = basename.replace(extname, "");
    let docxInfo;
    try {
        docxInfo = await mammoth.convertToHtml({ path: docxPath })  //通过path.join可以解决mac和window路径规则不一致的情况
    } catch (err) {
        console.log("===========docx2html调用失败 :【" + docxPath + "】 可能不是一个有效的docx文档========");
        console.log("======[无效文件可能原因：docx文件打开后产生的临时文件，或 ，直接将doc后缀改成docx后的文件 或...]=====");
        console.log(err);
        return;
    }
    let { value, messages } = docxInfo;
    if (showWarnMessage) {
        console.log(basename + "转换警告提示:", messages);
    }
    // 手动设置调整的标题样式
    let HSstyStr = `
<style>
    h1 {
        font-size: 32px;
    }

    h2 {
        font-size: 24px;
    }

    h3 {
        font-size: 18.72px;
    }

    h4 {
        font-size: 16px;
    }

    h5 {
        font-size: 13.28px;
    }

    h6 {
        font-size: 12px;
    }
</style>
    `;
    // 手动设置页面padding值
    let pagePadStrStr = `
        <style>
           body{
               padding-left:20px !important;
               padding-right:20px !important;;
           }
        </style>
            `;
    // 先拿到html字符串
    let html = value  // The generated HTML
    if (autoHsSty) {
        html = HSstyStr + value;
    }
    if (isAddpagePadV) {
        html = pagePadStrStr + html;
    }
    if (manualAssignment) {
        html = html + manualAssignment;
    }
    html = "<section>" + html + "</section>"; // The generated HTML
    html = addMenu2Page(html, fileName, { isAddHtmlHead, isAddMenu, isAddOrder });

    writeFile({ path: outPath, content: html, showExeResult: showExeResult })
}

export default docx2html
