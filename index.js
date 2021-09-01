(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('cheerio'), require('zl-ver-menu')) :
    typeof define === 'function' && define.amd ? define(['exports', 'cheerio', 'zl-ver-menu'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global['zl-createhnmenu'] = {}, global.cheerio, global.zl_ver_menu));
}(this, (function (exports, cheerio, zl_ver_menu) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var cheerio__default = /*#__PURE__*/_interopDefaultLegacy(cheerio);
    var zl_ver_menu__default = /*#__PURE__*/_interopDefaultLegacy(zl_ver_menu);

    // 给页面的所有标题元素添加id属性，用于后面的锚点跳转
    function addHsId($) {
        let hs = $("h1,h2,h3,h4,h5,h6");
        for (let i = 0; i < hs.length; i++) {
            let tagName;
            try {
                windows;
                tagName = hs[i].tagName;
            }
            catch {
                tagName = hs[i].name;
            }
            let eleId = $(hs[i]).prop("id");
            // console.log("===hs[i]====", tagName, eleId)
            //向元素注入id
            if (!eleId) $(hs[i]).prop("id", tagName + i);
        }
        return $.html();
    }

    // 如果内容没有外层的html，body包裹，则可使用此函数进行处理
    function addHtmlTag(content, fileName) {
        return `
    <!DOCTYPE html>
<html lang="zh-cn">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${fileName}</title>
    <script src="https://cdn.jsdelivr.net/npm/blogzl-indexjs@18.0.0/dist/jquery.min.js"></script>
</head>
<body>
    ${content}
</body>
</html>
    `;
    }

    // 返回要创建固定定位的菜单容器字符串，包含了html+css+js, 接收一个具体的菜单内容作为参数
    function createEndMenuTempla(realMenu) {
        //设置相关样式
        var anchorLinkDivStyle = `
<style>
#anchorLinkMenu{
     color:blue;
     position:fixed;
     top:5px;
     right: 10px;
     padding:10px;
     border-radius:5px;
     box-shadow: 1px 1px 5px;
     cursor: pointer;
     opacity: 0.4;
    }
 #anchorLinkMenu:hover{
    opacity: 1;
}
#anchorLinkContent {
    opacity: 1;
    padding: 5px;
   /* width: 400px; */
    position: fixed;
    box-shadow: 1px 1px 5px;
    border-radius: 10px 0 0 10px;
    top:5px;
    right: -410px;
    background-color: white;
    height:97vh;
    /*  overflow: scroll;*/
    transition: all 0.5s;

}
</style>
  `;
        //先往body的最后面添加两个div，分别表示菜单按钮和菜单内容
        var anchorLinkDiv = '<div id="anchorLinkMenu">目录菜单</div><div id="anchorLinkContent">666</div>';
        return anchorLinkDivStyle + `
    <script>
    createRightMenu();
    function createRightMenu() {
        //插入div和相关样式
        document.querySelector("body").innerHTML += '${anchorLinkDiv}';
        //绑定div按钮的点击事件
        var anchorLinkMene = document.querySelector("#anchorLinkMenu");
        var anchorLinkContent = document.querySelector("#anchorLinkContent");

        //给div菜单内容添加实际内容
        // var realMenu = document.querySelector("#" + realMenuId);
        // anchorLinkContent.appendChild(realMenu.cloneNode(true));
        $(anchorLinkContent).html(\`${realMenu}\`);
    
        // anchorLinkMene.onclick = function () {
        //     anchorLinkContent.style.cssText = "right:0;";
        // };
        // //当点击了具体的内容菜单后，隐藏此菜单
        // anchorLinkContent.onclick = function () {
        //     anchorLinkContent.style.cssText = "right:-410px;";
        // };

        anchorLinkMene.onmouseenter = function () {
            anchorLinkContent.style.cssText = "right:0;"
        }
        anchorLinkContent.onmouseleave = function () {
            anchorLinkContent.style.cssText = "right:-410px;"
        }
    }
    </script>
    `;
    }

    // 传入能获取所有页面元素的￥对象，从中获取由h1---h6组合成的树结构
    function resolveHtmlPageMenu($) {
        let hs = $("h1,h2,h3,h4,h5,h6");
        let list = [], listMap = {};
        let parEle = { tag: "root", id: "root" }; //标识当前操作的父标签，默认为root
        for (let i = 0; i < hs.length; i++) {
            let innerText, tagName, eleId;
            try {
                if (window) { //如果是在浏览器执行
                    innerText = hs[i].innerText;
                    tagName = hs[i].tagName;
                    eleId = hs[i].id;
                }
            } catch {
                innerText = $(hs[i]).text();
                tagName = hs[i].name;
                eleId = $(hs[i]).prop("id");
            }
            // console.log("===hs[i]====", innerText, tagName, eleId)
            if (parEle.tag == "root" || tagName == "h1") {
                //建立map关系
                listMap[i] = {
                    "id": i,
                    "eleId": eleId,
                    "tag": tagName,
                    "parent_id": "root",
                    "name": innerText,
                    "children": [

                    ]
                };
                // 数据入队
                list.push(listMap[i]);
                // 记录当前父节点id和名字
                parEle = { tag: tagName, id: i };
            }
            // 比较当前签标签的name是否大于父标签名，如果大于就直接注入到父的children中
            else if (tagName > parEle.tag) {
                //建立map关系
                listMap[i] = {
                    "id": i,
                    "eleId": eleId,
                    "tag": tagName,
                    "parent_id": parEle.id,
                    "name": innerText,
                    "children": [

                    ]
                };
                listMap[parEle.id].children.push(listMap[i]);
                parEle = { tag: tagName, id: i };
            }
            //  如果不大于，就和父节点的父节点进行比较，如果大于父节点的父节点时（或等于root），就写入父节点的父节点的children中（或者root的children中） ，如果还不大于就继续往上比较,重复这个过程
            else {
                let preNode = parEle.tag;//上级节点
                let preId = parEle.id;//上级节点id
                while (preNode != "root" && tagName <= preNode) {
                    preId = listMap[preId].parent_id;
                    preNode = listMap[preId].tag;
                }
                //开始判断
                if (preNode == "root") {
                    //建立map关系
                    listMap[i] = {
                        "id": i,
                        "eleId": eleId,
                        "tag": tagName,
                        "parent_id": "root",
                        "name": innerText,
                        "children": [

                        ]
                    };
                    // 数据入队
                    list.push(listMap[i]);
                } else {
                    //建立map关系
                    listMap[i] = {
                        "id": i,
                        "eleId": eleId,
                        "tag": tagName,
                        "parent_id": preId,
                        "name": innerText,
                        "children": [

                        ]
                    };
                    // 数据入队
                    listMap[preId].children.push(listMap[i]);
                }
                parEle = { tag: tagName, id: i };
            }
        }
        return list;
    }

    // 接收一个html字页面符串--给标题注入id-->得到tree菜单结构---》生成菜单模板--》注入到页面内容

    function addMenu2Page(html, fileName = "html文档", other) {
        let { isAddHtmlHead=true, isAddMenu=true } = other;
        if (isAddMenu) {
            // 使用cheerio模块向页面中的所有标题注入id
            const $ = cheerio__default['default'].load(html);
            html = addHsId($);
            // 得到菜单json对象
            let menuJson = resolveHtmlPageMenu($);
            // 得到构建的菜单相关模板
            let { styleStr, templateStr, jsStr } = zl_ver_menu__default['default']({
                show: false, data: menuJson,
                callback: function (par) {
                    location.hash = $(par).attr("data-id");
                },
                width: "300px"
            });
            // 根据模板构建真正的菜单
            let realMenu = createEndMenuTempla(templateStr);
            // 然后向他包裹html标签
            html = styleStr + realMenu + html + jsStr;
        }
        if (isAddHtmlHead) {
            html = addHtmlTag(html, fileName);
        }
        return html;
    }

    let mammoth = require("mammoth");
    var path = require("path");
    let zl_nodefs = require("zl-nodefs");
    let {
        writeFile, //创建/写入文件
        deleteFile,//删除文件夹/文件
        readFileList,//读取目录树tree
        readFileContent,//读取文件内容
        addFileContent //追加文件内容
    } = zl_nodefs;

    /**
        * @description 传入docx类型文档，会解析成html，同时给这个html注入菜单，最后写入指定的路径
        * @param {Object} parObj 完整的参数对象信息
        * @param {String} parObj.docxPath 要处理的docx文档路径
        * @param {Any} parObj.outPath 要输出的html文档路径，默认为当前docx文件所在目录
        * @param {Boolean} parObj.isAddHtmlHead  是否不给转换后的文档添加html,body等标签
        * @param {Boolean} parObj.isAddMenu   是否给转换后的html文件注入锚点菜单
        * @param {Boolean} parObj.showWarnMessage   是否显示docx文档转换为html时的警告信息（如果有的话），默认显示
        * @author zl-fire 2021/09/01
        * @example
        *  let res=writeFile({path:"./test8.txt",content:"helloworld",showExeResult:true});
        *  console.log("res",res)
      */
    async function docx2htmlAddMenu(parObj) {
        // 获取文件名字和后缀
        let basename = path.basename(parObj.docxPath);
        let extname = path.extname(parObj.docxPath);
        let {
            docxPath,
            outPath,
            isAddHtmlHead = true,
            isAddMenu = true,
            showWarnMessage = true,
        } = parObj;
        // 给输出路径添加默认值
        if (!outPath) outPath = docxPath.replace(extname, ".html");
        console.log("=============",outPath);
        // 不含后缀的名字
        let fileName = basename.replace(extname, "");
        let { value, messages } = await mammoth.convertToHtml({ path: docxPath });  //通过path.join可以解决mac和window路径规则不一致的情况
        if (showWarnMessage) {
            console.log(basename + "转换警告提示:", messages);
        }
        // 先拿到html字符串
        let html = value;  // The generated HTML
        html = "<section>" + html + "</section>"; // The generated HTML
        html = addMenu2Page(html, fileName, { isAddHtmlHead, isAddMenu });

        writeFile({ path: outPath, content: html, showExeResult: true });
    }

    exports.addMenu2Page = addMenu2Page;
    exports.docx2htmlAddMenu = docx2htmlAddMenu;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
