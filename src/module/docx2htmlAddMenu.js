let mammoth = require("mammoth");
var path = require("path");
import addMenu2Page from "./addMenu2Page";
let zl_nodefs = require("zl-nodefs");
let {
    writeFile, //创建/写入文件
    deleteFile,//删除文件夹/文件
    readFileList,//读取目录树tree
    readFileContent,//读取文件内容
    addFileContent //追加文件内容
} = zl_nodefs;

/**
    * @description 传入docx类型文档，会解析成html，同时给这个html注入菜单，最后写入指定的路径
    * @param {Object} parObj 完整的参数对象信息
    * @param {String} parObj.docxPath 要处理的docx文档路径
    * @param {Any} parObj.outPath 要输出的html文档路径，默认为当前docx文件所在目录
    * @param {Boolean} parObj.isAddHtmlHead  是否不给转换后的文档添加html,body等标签
    * @param {Boolean} parObj.isAddMenu   是否给转换后的html文件注入锚点菜单
    * @param {Boolean} parObj.showWarnMessage   是否显示docx文档转换为html时的警告信息（如果有的话），默认显示
    * @author zl-fire 2021/09/01
    * @example
    *  let res=writeFile({path:"./test8.txt",content:"helloworld",showExeResult:true});
    *  console.log("res",res)
  */
async function docx2htmlAddMenu(parObj) {
    // 获取文件名字和后缀
    let basename = path.basename(parObj.docxPath);
    let extname = path.extname(parObj.docxPath);
    let {
        docxPath,
        outPath,
        isAddHtmlHead = true,
        isAddMenu = true,
        showWarnMessage = true,
    } = parObj;
    // 给输出路径添加默认值
    if (!outPath) outPath = docxPath.replace(extname, ".html");
    console.log("=============",outPath)
    // 不含后缀的名字
    let fileName = basename.replace(extname, "");
    let { value, messages } = await mammoth.convertToHtml({ path: docxPath })  //通过path.join可以解决mac和window路径规则不一致的情况
    if (showWarnMessage) {
        console.log(basename + "转换警告提示:", messages);
    }
    // 先拿到html字符串
    let html = value  // The generated HTML
    html = "<section>" + html + "</section>"; // The generated HTML
    html = addMenu2Page(html, fileName, { isAddHtmlHead, isAddMenu });

    writeFile({ path: outPath, content: html, showExeResult: true })
}

export default docx2htmlAddMenu
