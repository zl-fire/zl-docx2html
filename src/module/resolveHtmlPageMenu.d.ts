export default resolveHtmlPageMenu;
/**
    * @description 传入能获取所有页面元素的$对象，从中获取由h1---h6组合成的树结构
    * @param {object} $ 能获取所有页面元素的$对象，这里使用的cheerio
    * @author zl-fire 2021/09/01
    * @return {object[]} json树结构
  */
declare function resolveHtmlPageMenu($: object): object[];
