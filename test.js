var { batchDocx2html, docx2html } = require("./index.js");
// (async function () {
//     console.log("转换完成1");
//     await docx2html({
//         docxPath: "./1. vue一些补充知识点.docx",
//         showWarnMessage: false,
//     });
//     console.log("转换完成2");
// })()

batchDocx2html({
    // dirPath: "./doctest",
    dirPath: "./",
    outPath:"./HTML",
    showWarnMessage: false,
});

// let extname = path.extname("1. vue一些补充知识点.docx");

// console.log("===extname====", extname, /\.\w+$/.test(extname));
