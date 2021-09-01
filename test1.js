var path = require("path");
let { docx2htmlAddMenu } = require("./index");
let fileName = "6660.docx";
let filePath = path.join(path.resolve("."), fileName); //通过path.join可以解决mac和window路径规则不一致的情况

(async function () {
    await docx2htmlAddMenu({
        docxPath: filePath,
        // outPath:path.join(path.resolve("."), "/aa/bb/cc/dd/eee.html"),
        showWarnMessage:false,
    })
})()
