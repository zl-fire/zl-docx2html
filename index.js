(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('mammoth'), require('zl_nodefs')) :
    typeof define === 'function' && define.amd ? define(['mammoth', 'zl_nodefs'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.mammoth, global.zl_nodefs));
}(this, (function (mammoth, zl_nodefs) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var mammoth__default = /*#__PURE__*/_interopDefaultLegacy(mammoth);
    var zl_nodefs__default = /*#__PURE__*/_interopDefaultLegacy(zl_nodefs);

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

    // console.log( path.resolve("."))
    let {
        writeFile, //创建/写入文件
        deleteFile,//删除文件夹/文件
        readFileList,//读取目录树tree
        readFileContent,//读取文件内容
        addFileContent //追加文件内容
    } = zl_nodefs__default['default'];



    // let fileName="graphqlAPI.docx";
    let fileName = "hell.docx";
    // // let fileName = "测试文档.doc";
    // console.log(path.resolve(".") + "\\" + fileName)

    // mammoth.convertToHtml({ path: path.resolve(".") + "\\" + fileName })  //文件路径需要给绝对的全路径(windows)
    mammoth__default['default'].convertToHtml({ path: path.resolve(".") + "/" + fileName })  //文件路径需要给绝对的全路径 (mac)
        .then(function (result) {
            // 先拿到html字符串
            var html = "<section>" + result.value + "</section>"; // The generated HTML
            html = resolveHtmlPageMenu(html);
            // html = JSON.stringify(html);
            // var messages = result.messages; // Any messages, such as warnings during conversion
            // console.log("messages========", messages)

            writeFile({ path: "./" + fileName.split(".")[0] + ".html", content: html, showExeResult: true });
        })
        .done();

})));
