export default batchDocx2html;
/**
    * @description 传入一个目录路径，将此路径下的所有docx文件批量转换为html文件（不管层级有多深）
    * @param {Object} parObj 完整的参数对象信息
    * @param {String} parObj.dirPath 要处理目录路径，可传入绝对路径，也可传入相对路径
    * @param {String} parObj.outPath 要输出的html文档路径
    * @param {Boolean} parObj.isAddHtmlHead  是否给转换后的文档添加html,body等标签
    * @param {Boolean} parObj.isAddMenu   是否给转换后的html文件注入锚点菜单
    * @param {Boolean} parObj.autoHsSty   是否添加手动注入的h1--h6的大小样式
    * @param {Boolean} parObj.isAddOrder   是否添加手动生成的序号
    * @param {Boolean} parObj.isAddpagePadV   是否给页面注入默认的padding值
    * @param {String} parObj.manualAssignment   用户手动注入的样式对象字符串：·<style>...</style>·
    * @param {Boolean} parObj.showWarnMessage   是否显示docx文档转换为html时的警告信息（如果有的话），默认显示
    * @param {Boolean} parObj.showExeResult   创建html文件时，是否要显示提示信息
    * @param {Boolean} parObj.isList2file   要转换的的文件树结构是否要写入文件
    * @param {Boolean} parObj.list2filePath   要转换的的文件树结构要写入文件时的文件路径
    * @author zl-fire 2021/09/01
    * @returns {object[]} 返回当前目录下要转换的的文件树结构
    * @example
    *
    * let { batchDocx2html } = require("zl-docx2html");
    * batchDocx2html({
    *     dirPath: "./",
    *     outPath:"./HTML",
    *     showWarnMessage: false,
    * });
    *
  */
declare function batchDocx2html(parObj: {
    dirPath: string;
    outPath: string;
    isAddHtmlHead: boolean;
    isAddMenu: boolean;
    autoHsSty: boolean;
    isAddOrder: boolean;
    isAddpagePadV: boolean;
    manualAssignment: string;
    showWarnMessage: boolean;
    showExeResult: boolean;
    isList2file: boolean;
    list2filePath: boolean;
}): object[];
