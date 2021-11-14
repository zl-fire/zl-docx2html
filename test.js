var { batchDocx2html, docx2html } = require("./index.js");

// // 单个转换
// (async function () {
//     console.log("转换完成1");
//     await docx2html({
//         // docxPath: "./testdoc/nginx基本使用.docx",
//         docxPath: "./testdoc/说明文档.md",
//         showWarnMessage: false,
//     });
//     console.log("转换完成2");
// })()



// 批量转换
batchDocx2html({
    // dirPath: "../",
    // outPath:"./htmldoc",
    dirPath: "./testdoc",
    outPath: "./htmldoc",
    showWarnMessage: false,
    showExeResult: true,
    isList2file: true,
    list2filePath: "./htmldoc/tree.json",
    // 注入广告
    adsContent:`<script>
    var _hmt = _hmt || [];
    (function() {
      var hm = document.createElement("script");
      hm.src = "https://hm.baidu.com/hm.js?9f6231e36b2965212308e701d3167983";
      var s = document.getElementsByTagName("script")[0]; 
      s.parentNode.insertBefore(hm, s);
    })();
    </script>
    `

});


// let path=require("path");
// let extname = path.extname("1. vue一些补充知识点.docx");

// console.log("===extname====", extname, /\.\w+$/.test(extname));
