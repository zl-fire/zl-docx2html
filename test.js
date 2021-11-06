var { batchDocx2html, docx2html } = require("./index.js");

// 单个转换
(async function () {
    console.log("转换完成1");
    await docx2html({
        docxPath: "./nginx基本使用.docx",
        showWarnMessage: false,
    });
    console.log("转换完成2");
})()



// 批量转换
// batchDocx2html({
//     // dirPath: "./doctest",
//     dirPath: "../",
//     outPath:"./HTML",
//     showWarnMessage: false,
//     showExeResult:true,
//     isList2file:true,
//     list2filePath:"./aa/bb/cc/dd/tt/tree.json"
// });

// let extname = path.extname("1. vue一些补充知识点.docx");

// console.log("===extname====", extname, /\.\w+$/.test(extname));
