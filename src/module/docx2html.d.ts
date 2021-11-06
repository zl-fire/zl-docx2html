export default docx2html;
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
declare function docx2html(parObj: {
    docxPath: string;
    outPath: string;
    isAddHtmlHead: boolean;
    isAddMenu: boolean;
    autoHsSty: boolean;
    isAddOrder: boolean;
    isAddpagePadV: boolean;
    manualAssignment: string;
    showWarnMessage: boolean;
    showExeResult: boolean;
}): Promise<void>;
