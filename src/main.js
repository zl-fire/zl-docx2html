import addHtmlTag from "./module/addHtmlTag";
import addMenu2Page from "./module/addMenu2Page";
import createEndMenuTempla from "./module/createEndMenuTempla";
import docx2html from "./module/docx2html";
import numberToChinese from "./module/numberToChinese";
import numToEng from "./module/numToEng";
import resolveHtmlPageMenu from "./module/resolveHtmlPageMenu";
let utils = {
    addHtmlTag, //给html主体内容字符串包裹html,head,body标签
    createEndMenuTempla,//返回要固定定位的菜单容器字符串
    numberToChinese,//将阿拉伯数字转换成中文的大写数字
    numToEng,//通过ASCII码的方式将1-26转换为字母a-z(可大写可小写)
    resolveHtmlPageMenu,//传入能获取所有页面元素的$对象，从中获取由h1---h6组合成的树结构
};
export {
    addMenu2Page,  //如果已有html字符串 就可以调用这个函数
    docx2html, //如果要从docx文档转换为含有菜单的html页面 就可以调用这个函数
    utils
}