export default addHtmlTag;
/**
    * @description 如果内容没有外层的html，body包裹，则可使用此函数进行处理
    * @param {string} content 要处理的html字符串
    * @param {string} fileName html字符串的名字
    * @param {string} docType  原始文档类型，不传的话默认为doxc，可传如md
    * @author zl-fire 2021/09/01
    * @return {string} 包裹了html,body的最终的字符串
  */
declare function addHtmlTag(content: string, fileName: string, docType: string): string;
