import Md2Html from "./module/Md2Html";
import addHtmlTag from "./module/addHtmlTag";
import addMenu2Page from "./module/addMenu2Page";
import createEndMenuTempla from "./module/createEndMenuTempla";
import docx2html from "./module/docx2html";
import numberToChinese from "./module/numberToChinese";
import numToEng from "./module/numToEng";
import numToEng0_26 from "./module/numToEng0_26";
import resolveHtmlPageMenu from "./module/resolveHtmlPageMenu";
import batchDocx2html from "./module/batchDocx2html";
let utils = {
    Md2Html,//将md文档转换为html字符串
    addHtmlTag, //给html主体内容字符串包裹html,head,body标签
    createEndMenuTempla,//返回要固定定位的菜单容器字符串
    numberToChinese,//将阿拉伯数字转换成中文的大写数字
    numToEng,//将数字转换为英文字母，大于26的数字也可以，并可控制大写和小写
    numToEng0_26,//通过ASCII码的方式将1-26转换为字母a-z(可大写可小写)
    resolveHtmlPageMenu,//传入能获取所有页面元素的$对象，从中获取由h1---h6组合成的树结构
};
export {
    addMenu2Page,  //如果已有html字符串 就可以调用这个函数
    docx2html, //如果要从docx文档转换为含有菜单的html页面 就可以调用这个函数
    batchDocx2html,//传入一个目录路径，将此路径下的所有docx文件批量转换为html文件（不管层级有多深）
    utils
}