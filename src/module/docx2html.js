let mammoth = require("mammoth");
var path = require("path");
const zl_enc_dec = require("zl-enc-dec");
import addMenu2Page from "./addMenu2Page";
import Md2Html from "./Md2Html";
let zl_nodefs = require("zl-nodefs");
let {
    writeFile, //创建/写入文件
    copycutFiledir,//复制剪切文件/文件夹
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
    * @param {String} parObj.manualAssignment   用户手动注入的样式对象字符串：·<style>...</style>·
    * @param {Boolean} parObj.showWarnMessage   是否显示docx文档转换为html时的警告信息（如果有的话），默认显示
    * @param {Boolean} parObj.showExeResult   创建html文件时，是否要显示提示信息
    * @param {string}  parObj.adsContent  要添加的广告脚本,默认为空
    * @param {string}  parObj.imgTobase64  是否将docx文档中的图片转换为base64,默认false，不转换
    * 
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
        manualAssignment,
        adsContent,
        imgTobase64 = false
    } = parObj;
    // 给输出路径添加默认值
    if (!outPath) outPath = docxPath.replace(extname, ".html");
    // 不含后缀的名字
    let fileName = basename.replace(extname, "");
    let docxInfo, docTypeObj = {};
    try {
        // 说明是docx文档
        if (extname === ".docx") {
            var options = {
                // 将base64图片写入到本地磁盘中
                convertImage: mammoth.images.imgElement(function (image) {
                    let type = image.contentType.split("/")[1];//图片格式类型
                    return image.read("base64").then(function (imageBuffer) {
                        const dataBuffer = new Buffer.from(imageBuffer, 'base64'); //把base64码转成buffer对象，
                        const hash = zl_enc_dec.md5(dataBuffer);
                        // 图片写入路径格式：父目录/.._imgs/...文件名.png
                        let imgName = hash + '.' + type;
                        let imgPath = path.join(outPath, "../", fileName + "_imgs", imgName);
                        writeFile({ path: imgPath, content: dataBuffer, showExeResult: true });
                        return {
                            src: "./" + fileName + "_imgs/" + imgName
                        };
                    });
                })
            };
            // 转换为base64
            if (imgTobase64) {
                docxInfo = await mammoth.convertToHtml({ path: docxPath })  //通过path.join可以解决mac和window路径规则不一致的情况
            }
            // 将图片写入为单独的文件
            else {
                docxInfo = await mammoth.convertToHtml({ path: docxPath }, options)  //通过path.join可以解决mac和window路径规则不一致的情况
            }
            docxInfo.value = `<article class="docx-body">${docxInfo.value}</article>`;
            docTypeObj = { docType: "docx" };

        }
        // 说明是markdown文档
        else if (extname === ".md") {
            let content = await new Md2Html(docxPath).md2html();
            content = `<article class="markdown-body">${content}</article>`;
            docxInfo = { value: content, messages: "markdown文档" };
            docTypeObj = { docType: "md" };
        }
    } catch (err) {
        console.log("\n-------------------------------");
        console.log("[出错了哦]----" + docxPath + "---- 转换失败. \n[错误提示] ", err.message, "\n[可能原因] 此docx文件是一个临时文件, 或是被改了后缀的docx文件, 或是空的docx文件, 或...==");
        console.log("-------------------------------\n");
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
    html = addMenu2Page(html, fileName, { isAddHtmlHead, isAddMenu, isAddOrder, ...docTypeObj, adsContent });

    writeFile({ path: outPath, content: html, showExeResult: showExeResult });

    // 将图片信息写入过去
    if (extname === ".md") {
        // 处理assets路径问题
        let assetsPath1 = path.join(docxPath, "../", "assets");
        let assetsPath2 = path.join(outPath, "../", "assets");

        // console.log("===docxPath==",docxPath)
        // console.log("===assetsPath1==",assetsPath1)
        // console.log("===outPath==",outPath)
        // console.log("===assetsPath2==",assetsPath2)

        // 复制或剪切文件/文件夹
        copycutFiledir({
            inputFileUrl: assetsPath1,
            outFileUrl: assetsPath2,
            copyOrCut: "copy",
            // showExeResult:false,
            rewrite: false
        })
    }

}

export default docx2html
