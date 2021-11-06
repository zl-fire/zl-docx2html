export default addMenu2Page;
/**
    * @description 接收一个html字页面符串--给标题注入id-->得到tree菜单结构---》生成菜单模板--》注入到页面内容并返回
    * @param {Object} parObj 完整的参数对象信息
    * @param {String} parObj.html 要处理的html字符串
    * @param {String} parObj.fileName 生成的html文件名（如果存在html,head,外层的标签的话）
    * @param {Object} other 接收其他信息的对象
    * @param {Boolean} other.isAddHtmlHead  是否不给转换后的文档添加html,body等标签,默认为true
    * @param {Boolean} other.isAddMenu   是否给转换后的html文件注入锚点菜单,默认为true
    * @param {Boolean} other.isAddOrder   是否添加手动生成的序号,默认为true
    * @param {Boolean} other.docType   原始文档类型，不传的话默认为doxc，可传如md
    * @author zl-fire 2021/09/01
    * @example
    * let html = addMenu2Page(html, fileName);
  */
declare function addMenu2Page(html: any, fileName?: string, other?: {
    isAddHtmlHead: boolean;
    isAddMenu: boolean;
    isAddOrder: boolean;
    docType: boolean;
}): any;
