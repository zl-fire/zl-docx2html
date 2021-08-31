// 接收一个html字页面符串--给标题注入id-->得到tree菜单结构---》生成菜单模板--》注入到页面内容
import cheerio from "cheerio";
import zl_ver_menu from "zl_ver_menu";
import addHsId from "./addHsId";
import addHtmlTag from "./addHtmlTag";
import createEndMenuTempla from "./createEndMenuTempla";
import resolveHtmlPageMenu from "./resolveHtmlPageMenu";

function addMenu2Page(html) {
    // 使用cheerio模块向页面中的所有标题注入id
    const $ = cheerio.load(html);
    html = addHsId($);
    // 得到菜单json对象
    let menuJson = resolveHtmlPageMenu($);
    // 得到构建的菜单相关模板
    let { styleStr, templateStr, jsStr } = zl_ver_menu({
        show: false, data: menuJson,
        callback: function (par) {
            location.hash = $(par).attr("data-id");
        },
        width: "300px"
    });
    // 根据模板构建真正的菜单
    let realMenu = createEndMenuTempla(templateStr)
    // 然后向他包裹html标签
    html = addHtmlTag(styleStr + realMenu + html + jsStr, fileName);
    return html;
}

export default addMenu2Page;