import cheerio from "cheerio";
import zl_ver_menu from "zl-ver-menu";
import addHsId from "./addHsId";
import addHtmlTag from "./addHtmlTag";
import createEndMenuTempla from "./createEndMenuTempla";
import resolveHtmlPageMenu from "./resolveHtmlPageMenu";
import addHsOrder from "./addHsOrder";

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
    * @param {string}  other.adsContent  要添加的广告脚本,默认为空
    * 
    * @author zl-fire 2021/09/01
    * @example
    * let html = addMenu2Page(html, fileName);
  */
function addMenu2Page(html, fileName = "html文档", other = {}) {
    let { isAddHtmlHead = true, isAddMenu = true, isAddOrder = true, docType ,adsContent} = other;
    if (isAddMenu) {
        // 使用cheerio模块向页面中的所有标题注入id
        const $ = cheerio.load(html);
        html = addHsId($);
        // 得到菜单json对象
        let menuJson = resolveHtmlPageMenu($);
        // 如果页面不存在任何菜单
        if (menuJson.length == 0) {
            if (isAddHtmlHead) {
                html = addHtmlTag(html, fileName, docType, adsContent);
            }
            return html;
        }
        if (isAddOrder) {
            // 向页面标题中注入序号
            html = addHsOrder($, menuJson);
        }
        // 得到构建的菜单相关模板
        let { styleStr, templateStr, jsStr } = zl_ver_menu({
            show: true,
            data: menuJson,
            callback: function (par) {
                location.hash = $(par).attr("data-id");
            },
            width: "281px",
            defaultSelect: false //默认不选择第一个菜单项
        });
        // 将模板字符串作为内容 构建固定定位的实际菜单
        let realMenu = createEndMenuTempla(templateStr)
        // 然后向他包裹html标签
        html = styleStr + realMenu + html + jsStr;
        // 如果要添加菜单 但是 不加头信息
        if (isAddMenu && !isAddHtmlHead) {
            html = `<body> 
            <script src="https://cdn.jsdelivr.net/npm/blogzl-indexjs@18.0.0/dist/jquery.min.js"></script>
             ${html}  
           </body>"; `// The generated HTML
        }
    }
    if (isAddHtmlHead) {
        html = addHtmlTag(html, fileName, docType, adsContent);
    }

    return html;
}

export default addMenu2Page;