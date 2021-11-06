(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('cheerio'), require('zl-ver-menu')) :
    typeof define === 'function' && define.amd ? define(['exports', 'cheerio', 'zl-ver-menu'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global['zl-docx2html'] = {}, global.cheerio, global.zl_ver_menu));
}(this, (function (exports, cheerio, zl_ver_menu) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var cheerio__default = /*#__PURE__*/_interopDefaultLegacy(cheerio);
    var zl_ver_menu__default = /*#__PURE__*/_interopDefaultLegacy(zl_ver_menu);

    /**
     * markdown文件转html页面
     * @constructor
     */
    class Md2Html {
        constructor(fileName) {
            this.fs = require('fs'); //文件模块
            this.path = require('path'); //路径模块
            this.marked = require('marked').marked; //md转html模块
            this.fileName = fileName || 'unnamed';
        }

        /**
        * 将marked转换为html
        */
        md2html() {
           return new Promise((resolve,reject)=>{
                this.fs.readFile(this.fileName, 'utf-8', (err, data) => { //读取文件
                    if (err) {
                        throw err;
                    }
                    // 同步使用 highlight.js 转换代码
                    this.marked.setOptions({
                        highlight: function (code) {
                            return require('highlight.js').highlightAuto(code).value
                        }
                    });
                    const content = this.marked(data); //将md内容转为html内容
                    resolve(content);
                });
            })
        }
    }

    // 使用示例
    // let path=require("path");
    // await new Md2Html(docxPath).md2html();

    /**
        * @description 如果内容没有外层的html，body包裹，则可使用此函数进行处理
        * @param {string} content 要处理的html字符串
        * @param {string} fileName html字符串的名字
        * @param {string} docType  原始文档类型，不传的话默认为doxc，可传如md
        * @author zl-fire 2021/09/01
        * @return {string} 包裹了html,body的最终的字符串
      */
    function addHtmlTag(content, fileName, docType) {
        if (docType !== "md") {
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
        else {
            return `<!DOCTYPE html>
        <html>
            <head>
            <meta charset="utf-8" >
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>${fileName}</title>
            <script src="https://cdn.jsdelivr.net/npm/blogzl-indexjs@18.0.0/dist/jquery.min.js"></script>
            <style>
                .markdown-body {
                    box-sizing: border-box;
                    min-width: 200px;
                    width:80%;
                    float:left;
                    margin: 0 auto;
                    padding: 45px;
                }
                @media (min-width: 1439px) {
                    .markdown-body {
                        float:left;
                    }
                }
                @media (max-width: 1438px) {
                    .markdown-body {
                        float:revert;
                    }
                }
                @media (max-width: 767px) {
                    .markdown-body {
                        padding: 15px;
                    }
                }
            </style>
            <link href="https://cdn.bootcss.com/github-markdown-css/4.0.0/github-markdown.min.css" rel="stylesheet">
            <link href="https://cdn.bootcss.com/highlight.js/9.12.0/styles/github-gist.min.css" rel="stylesheet">
            </head>
            <body>
                ${content}
            </body>
        </html>`;
        }

    }

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

    /**
        * @description 返回要创建固定定位的菜单容器字符串（固定格式），包含了html+css+js, 接收一个具体的菜单内容作为参数
        * @param {string} realMenu 菜单html字符串
        * @author zl-fire 2021/09/01
        * @return {string} 生成的最终的包含了样式和js逻辑的菜单字符串
      */
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
    background-color: #c5bcbc;
    height:97vh;
    /*  overflow: scroll;*/
    transition: all 1s;

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
        function resizefn(){
            if(document.documentElement.clientWidth<1440){
                anchorLinkContent.style.cssText = "right:-410px;"
                anchorLinkMene.onmouseenter = function () {
                    anchorLinkContent.style.cssText = "right:0;"
                }
                anchorLinkContent.onmouseleave = function () {
                    anchorLinkContent.style.cssText = "right:-410px;"
                }
            }
            else{
                anchorLinkContent.style.cssText = "right:0;"
                anchorLinkMene.onmouseenter=null;
                anchorLinkContent.onmouseleave=null;
            }
        }
        resizefn();//初始化执行一次
        window.onresize=function(){
            resizefn();
          }
    }
    </script>
    `;
    }

    /**
        * @description 传入能获取所有页面元素的$对象，从中获取由h1---h6组合成的树结构
        * @param {object} $ 能获取所有页面元素的$对象，这里使用的cheerio
        * @author zl-fire 2021/09/01
        * @return {object[]} json树结构
      */
    function resolveHtmlPageMenu($) {
        let hs = $("h1,h2,h3,h4,h5,h6");
        let list = [];
        let parEle = { tag: "root", id: "root" }; //标识当前操作的父标签，默认为root
        let listMap = { "root": parEle };
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

    /**
        * @description 将阿拉伯数字转换成中文的大写数字
        * @param {number} num 要转换的阿拉伯数字
        * @author zl-fire 2021/09/01
        * @return {string} 中文的大写数字字符串
        * @example
        * let n=numberToChinese(12);//返回'十二'
      */
    function numberToChinese (num) {
        var AA = new Array("零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十");
        var BB = new Array("", "十", "百", "仟", "萬", "億", "点", "");
        var a = ("" + num).replace(/(^0*)/g, "").split("."),
            k = 0,
            re = "";
        for (var i = a[0].length - 1; i >= 0; i--) {
            switch (k) {
                case 0:
                    re = BB[7] + re;
                    break;
                case 4:
                    if (!new RegExp("0{4}//d{" + (a[0].length - i - 1) + "}$")
                        .test(a[0]))
                        re = BB[4] + re;
                    break;
                case 8:
                    re = BB[5] + re;
                    BB[7] = BB[5];
                    k = 0;
                    break;
            }
            if (k % 4 == 2 && a[0].charAt(i + 2) != 0 && a[0].charAt(i + 1) == 0)
                re = AA[0] + re;
            if (a[0].charAt(i) != 0)
                re = AA[a[0].charAt(i)] + BB[k % 4] + re;
            k++;
        }

        if (a.length > 1) // 加上小数部分(如果有小数部分)
        {
            re += BB[6];
            for (var i = 0; i < a[1].length; i++)
                re += AA[a[1].charAt(i)];
        }
        if (re == '一十')
            re = "十";
        if (re.match(/^一/) && re.length == 3)
            re = re.replace("一", "");
        return re;
    }

    /**
        * @description 将数字转换为英文字母，大于26的数字也可以，并可控制大写和小写
        * @param {number} i 要转换的阿拉伯数字
        * @param {boolean} big true:大写，false|不传:为小写
        * @author zl-fire 2021/09/01
        * @return {string} a-z英文字母
        * @example
        * let n=numToEng(1);//返回'a'
      */
    function numToEng(i, big) {
      var s = "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z";
      // 默认小写（即没传big或big未false时，就为小写）
      if (!big) {
        s = s.toLocaleLowerCase();
      }
      var sArray = s.split(" ");
      if (i < 1) {
        return "";
      } else if (parseInt((i / 26) + "") == 0) {
        return sArray[i % 26 - 1];
      } else {
        if (i % 26 == 0) {
          return (transform(parseInt((i / 26) + "") - 1)) + sArray[26 - 1];
        } else {
          return sArray[parseInt((i / 26) + "") - 1] + sArray[i % 26 - 1];
        }
      }
    }

    // 先给每个list标题编一个序号，在给所有的id一致的标题注入这个序号
    function addHsOrder($, list) {
        var id2HsMap = {};
        // 先给每个list标题编一个序号，id为键，序号为值
        deepCall(list, id2HsMap);
        // 然后在遍历所有标题，依次将序号写入进去
        let hs = $("h1,h2,h3,h4,h5,h6");
        for (let i = 0; i < hs.length; i++) {
            // let tagName, text;
            let text;
            try {
                windows;
                // tagName = hs[i].tagName;
                text = hs[i].innerText;
            }
            catch {
                // tagName = hs[i].name;
                text = $(hs[i]).text();

            }
            let eleId = $(hs[i]).prop("id");
            // 获取新的名字：序号+原名
            // let newName = handOrder({ tagName, text, id2HsMap, eleId });
            let newName =  id2HsMap[eleId]+". "+text;
            //向元素注入新的，名字
            $(hs[i]).text(newName);
        }
        return $.html();
    }

    function deepCall(children, id2HsMap, parOrder) {
        if (children && children.length > 0) {
            for (let i = 0; i < children.length; i++) {
                // 修改标题（加上序号）
                let text = children[i].name;
                let orderNum;
                if (parOrder) {
                    orderNum = parOrder + "." + (i + 1);
                }
                else {
                    orderNum = i + 1;
                }
                id2HsMap[children[i].eleId] = orderNum;
                // let newName = handOrder({ tagName, text, orderNum }); //不再使用这个序号编码，
                let newName = orderNum + ". " + text; //新序号方式全部使用阿拉伯数字
                children[i].name = newName;
                //递归调用
                deepCall(children[i].children, id2HsMap, orderNum);
            }
        }
    }

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
    function addMenu2Page(html, fileName = "html文档", other = {}) {
        let { isAddHtmlHead = true, isAddMenu = true, isAddOrder = true,docType } = other;
        if (isAddMenu) {
            // 使用cheerio模块向页面中的所有标题注入id
            const $ = cheerio__default['default'].load(html);
            html = addHsId($);
            // 得到菜单json对象
            let menuJson = resolveHtmlPageMenu($);
            // 如果页面不存在任何菜单
            if (menuJson.length == 0) {
                if (isAddHtmlHead) {
                    html = addHtmlTag(html, fileName);
                }
                return html;
            }
            if (isAddOrder) {
                // 向页面标题中注入序号
                html = addHsOrder($, menuJson);
            }
            // 得到构建的菜单相关模板
            let { styleStr, templateStr, jsStr } = zl_ver_menu__default['default']({
                show: true,
                data: menuJson,
                callback: function (par) {
                    location.hash = $(par).attr("data-id");
                },
                width: "281px"
            });
            // 将模板字符串作为内容 构建固定定位的实际菜单
            let realMenu = createEndMenuTempla(templateStr);
            // 然后向他包裹html标签
            html = styleStr + realMenu + html + jsStr;
            // 如果要添加菜单 但是 不加头信息
            if (isAddMenu && !isAddHtmlHead) {
                html = `<body> 
            <script src="https://cdn.jsdelivr.net/npm/blogzl-indexjs@18.0.0/dist/jquery.min.js"></script>
             ${html}  
           </body>"; `;// The generated HTML
            }
        }
        if (isAddHtmlHead) {
            html = addHtmlTag(html, fileName,docType);
        }

        return html;
    }

    let mammoth = require("mammoth");
    var path$1 = require("path");
    let zl_nodefs$1 = require("zl-nodefs");
    let {
        writeFile: writeFile$1, //创建/写入文件
        copycutFiledir,//复制剪切文件/文件夹
    } = zl_nodefs$1;

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
    async function docx2html(parObj) {
        // 获取文件名字和后缀
        let basename = path$1.basename(parObj.docxPath);
        let extname = path$1.extname(parObj.docxPath);
        let {
            docxPath,
            outPath,
            isAddHtmlHead = true,
            isAddMenu = true,
            showWarnMessage = true,
            showExeResult = true,
            autoHsSty = true,
            isAddOrder = true,
            isAddpagePadV = true,
            manualAssignment
        } = parObj;
        // 给输出路径添加默认值
        if (!outPath) outPath = docxPath.replace(extname, ".html");
        // 不含后缀的名字
        let fileName = basename.replace(extname, "");
        let docxInfo, docTypeObj = {};
        try {
            // 说明是docx文档
            if (extname === ".docx") {
                docxInfo = await mammoth.convertToHtml({ path: docxPath });  //通过path.join可以解决mac和window路径规则不一致的情况
            }
            // 说明是markdown文档
            else if (extname === ".md") {
                let content = await new Md2Html(docxPath).md2html();
                content = `<article class="markdown-body">${content}</article>`;
                docxInfo = { value: content, messages: "markdown文档" };
                docTypeObj = { docType: "md" };
            }
        } catch (err) {
            console.log("\n-------------------------------");
            console.log("[出错了哦]----" + docxPath + "---- 转换失败. \n[错误提示] ", err.message, "\n[可能原因] 此docx文件是一个临时文件, 或是被改了后缀的docx文件, 或是空的docx文件, 或...==");
            console.log("-------------------------------\n");
            return;
        }
        let { value, messages } = docxInfo;
        if (showWarnMessage) {
            console.log(basename + "转换警告提示:", messages);
        }
        // 手动设置调整的标题样式
        let HSstyStr = `
<style>
    h1 {
        font-size: 32px;
    }

    h2 {
        font-size: 24px;
    }

    h3 {
        font-size: 18.72px;
    }

    h4 {
        font-size: 16px;
    }

    h5 {
        font-size: 13.28px;
    }

    h6 {
        font-size: 12px;
    }
</style>
    `;
        // 手动设置页面padding值
        let pagePadStrStr = `
        <style>
           body{
               padding-left:20px !important;
               padding-right:20px !important;;
           }
        </style>
            `;
        // 先拿到html字符串
        let html = value;  // The generated HTML
        if (autoHsSty) {
            html = HSstyStr + value;
        }
        if (isAddpagePadV) {
            html = pagePadStrStr + html;
        }
        if (manualAssignment) {
            html = html + manualAssignment;
        }
        html = "<section>" + html + "</section>"; // The generated HTML
        html = addMenu2Page(html, fileName, { isAddHtmlHead, isAddMenu, isAddOrder, ...docTypeObj });

        writeFile$1({ path: outPath, content: html, showExeResult: showExeResult });

        // 将图片信息写入过去
        if (extname === ".md") {
            // 处理assets路径问题
            let assetsPath1 = path$1.join(docxPath,"../","assets");
            let assetsPath2 = path$1.join(outPath,"../","assets");

            // console.log("===docxPath==",docxPath)
            // console.log("===assetsPath1==",assetsPath1)
            // console.log("===outPath==",outPath)
            // console.log("===assetsPath2==",assetsPath2)

            // 复制或剪切文件/文件夹
            copycutFiledir({
                inputFileUrl: assetsPath1,
                outFileUrl: assetsPath2,
                copyOrCut: "copy",
                // showExeResult:false,
                rewrite: false
            });
        }

    }

    /**
        * @description 通过ASCII码的方式将1-26转换为字母a-z(可大写可小写)
        * @param {number} num 要转换的阿拉伯数字1-26
        * @param {boolean} big true:大写，false|不传:为小写
        * @author zl-fire 2021/09/01
        * @return {string} 英文字母a-zA-Z
        * @example
        * let n=numToEng0_26(1);//返回'a'
      */
     function numToEng0_26(num, big) {
        // 默认转换为小写
        if (!big) {
          return String.fromCharCode(64 + parseInt(num) + 32);
        }
        else {
          // 转换为大写
          return String.fromCharCode(64 + parseInt(num));
        }
      }

    var path = require("path");
    let zl_nodefs = require("zl-nodefs");
    let {
        readFileList,//读取目录下的文件列表
        writeFile,//将数据写入文件
    } = zl_nodefs;
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
    async function batchDocx2html(parObj) {
        // 对参数进行解构
        let {
            dirPath,
            outPath,
            isAddHtmlHead = true,
            isAddMenu = true,
            showWarnMessage = true,
            showExeResult = true,
            autoHsSty = true,
            isAddOrder = true,
            isAddpagePadV = true,
            isList2file = false,//默认树结构不写入文件
            list2filePath = "",//要转换的的文件树结构要写入文件时的文件路径
            manualAssignment
        } = parObj;

        //获取指定路径下的所有docx文件，不限层级
        let list = readFileList({
            dirPath: dirPath,
            ignoreList: ["node_modules", ".git"],
            needTypes: [".docx",".md"],
            isfilterEmptyDir: true
        });
        if (showExeResult) console.log("====当前目录结构为：=====\n", JSON.stringify(list, null, 4));
        // 是否将目录树写入到磁盘中
        if (isList2file) {
            if (!list2filePath) list2filePath = outPath + "/tree.json";
            writeFile({
                path: list2filePath,
                content: JSON.stringify(list),
                showExeResult: showExeResult,
            });
        }
        // ========开始把list中的所有docx文件进行转换==========
        // 设置docx文件的基础路径
        let docxBasePath = dirPath;
        // 如果用户没有主动传入输出路径，就将html生成到当前word基础目录的同级目录下
        let htmlBasePath = outPath || path.join(docxBasePath, "../", "html" + new Date().getTime());
        await recursionCreateHtmlFile(list, docxBasePath, htmlBasePath);
        console.log("\n\n=============目录[" + docxBasePath + "]下的docx文件转换完毕================\n\n");

        async function recursionCreateHtmlFile(list, currentDocxPath, currentHtmlPath) {
            for (let i = 0; i < list.length; i++) {
                let obj = list[i];
                let { name, children } = obj;
                let docxPath = path.join(currentDocxPath, name);
                let htmlPath = path.join(currentHtmlPath, name);
                //   children存在，说明是目录
                if (children) {
                    await recursionCreateHtmlFile(children, docxPath, htmlPath);
                }
                else {
                    await docx2html({
                        docxPath: docxPath,
                        outPath: htmlPath.replace(name.match(/\.\w+$/)[0], "") + ".html",
                        isAddHtmlHead,
                        isAddMenu,
                        showWarnMessage,
                        showExeResult,
                        autoHsSty,
                        isAddOrder,
                        isAddpagePadV,
                        manualAssignment
                    });

                }
            }
        }

        return list;
    }

    let utils = {
        Md2Html,//将md文档转换为html字符串
        addHtmlTag, //给html主体内容字符串包裹html,head,body标签
        createEndMenuTempla,//返回要固定定位的菜单容器字符串
        numberToChinese,//将阿拉伯数字转换成中文的大写数字
        numToEng,//将数字转换为英文字母，大于26的数字也可以，并可控制大写和小写
        numToEng0_26,//通过ASCII码的方式将1-26转换为字母a-z(可大写可小写)
        resolveHtmlPageMenu,//传入能获取所有页面元素的$对象，从中获取由h1---h6组合成的树结构
    };

    exports.addMenu2Page = addMenu2Page;
    exports.batchDocx2html = batchDocx2html;
    exports.docx2html = docx2html;
    exports.utils = utils;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
