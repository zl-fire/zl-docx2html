// import mammoth from "mammoth";
// import zl_nodefs from "zl_nodefs";
// import resolveHtmlPageMenu from "./module/resolveHtmlPageMenu";
let addMenu2Page = require("./index");
let zl_nodefs = require("zl-nodefs");

let mammoth = require("mammoth");
var path = require("path");


// console.log( path.resolve("."))
let {
    writeFile, //创建/写入文件
    deleteFile,//删除文件夹/文件
    readFileList,//读取目录树tree
    readFileContent,//读取文件内容
    addFileContent //追加文件内容
} = zl_nodefs;



// let fileName="graphqlAPI.docx";
let fileName = "666.docx";
// // let fileName = "测试文档.doc";
// console.log(path.resolve(".") + "\\" + fileName)

// mammoth.convertToHtml({ path: path.resolve(".") + "\\" + fileName })  //文件路径需要给绝对的全路径(windows)
mammoth.convertToHtml({ path: path.resolve(".") + "/" + fileName })  //文件路径需要给绝对的全路径 (mac)
    .then(function (result) {
        // 先拿到html字符串
        var html = "<section>" + result.value + "</section>"; // The generated HTML
        html = addMenu2Page(html,fileName);
        // html = JSON.stringify(html);
        // var messages = result.messages; // Any messages, such as warnings during conversion
        // console.log("messages========", messages)

        writeFile({ path: "./" + fileName.split(".")[0] + ".html", content: html, showExeResult: true })
    })
    .done();



