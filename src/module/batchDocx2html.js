var path = require("path");
// import docx2html from "./docx2html";
let zl_nodefs = require("zl-nodefs");
let {
    readFileList,//读取目录下的文件列表
} = zl_nodefs;
/**
    * @description 传入一个目录路径，将此路径下的所有docx文件批量转换为html文件
    * @param {Object} parObj 完整的参数对象信息
    * @param {String} parObj.dirPath 要处理目录路径，可传入绝对路径，也可传入相对路径
    * @param {String} parObj.outPath 要输出的html文档路径
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
async function batchDocx2html(parObj) {
    // 对参数进行解构
    let {
        dirPath,
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
    //获取指定路径下的所有docx文件
    let list = readFileList({
        dirPath: dirPath,
        ignoreList: ["node_modules", ".git"],
        needTypes: [".docx"],
    });
    // // 递归遍历对象数组，生成一个map对象
    let id2objMap = {};
    deepCallGetMapObj({ list, id2objMap, field: "id" });
    // console.log("======id2objMap========", id2objMap);
    signEmptyDir(list, id2objMap); //标识空目录
    console.log("============list======11", JSON.stringify(list, null, 4))
    deleteEmpty(list);
    console.log("============list======22", JSON.stringify(list, null, 4));

}

// export default batchDocx2html;

batchDocx2html({
    dirPath: "./"
})

// let extname = path.extname("1. vue一些补充知识点.docx");

// console.log("===extname====", extname, /\.\w+$/.test(extname));