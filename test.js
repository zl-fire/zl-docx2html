var path = require("path");
// import docx2html from "./docx2html";
// import deepCallGetMapObj from "./deepCallGetMapObj";
// let deepCallGetMapObj = require("./deepCallGetMapObj");
let zl_nodefs = require("zl-nodefs");
let {
    readFileList,//读取目录下的文件列表
} = zl_nodefs;


/**
 * @description 递归遍历对象数组，生成一个map对象,指定字段为键，对象元素为值
 * @param {Object} parObj 完整的参数对象信息
 * @param {String} parObj.list 要处理的对象数组
 * @param {String} parObj.id2objMap 生成的map对象
 * @param {Boolean} parObj.field  作为id的指定键
 * @author zl-fire 2021/09/02
 * @example
 * let list=[
 *     {
 *         "id": 111,
 *         "name": 222
 *     },
 *     {
 *         "id": 222,
 *         "name": 333,
 *         "children": [
 *             {
 *                 "id": 333,
 *                 "name": 444
 *             }
 *         ]
 *     }
 * ];
 * let id2objMap={};
 * let field="id";
 * deepCallGetMapObj({ list, id2objMap, field});
 * console.log(id2objMap);
 * //id2objMap值将会如下所示
 * {
 *     "111": {
 *         "id": 111,
 *         "name": 222
 *     },
 *     "222": {
 *         "id": 222,
 *         "name": 333,
 *         "children": [
 *             {
 *                 "id": 333,
 *                 "name": 444
 *             }
 *         ]
 *     },
 *     "333": {
 *         "id": 333,
 *         "name": 444
 *     }
 * }
*/
function deepCallGetMapObj(parObj) {
    let { list, id2objMap, field } = parObj;
    if (list && list.length > 0) {
        for (let i = 0; i < list.length; i++) {
            id2objMap[list[i][field]] = list[i];
            //递归调用
            if (list[i].children)
                deepCallGetMapObj({ list: list[i].children, id2objMap, field });
        }
    }
}
// export default deepCallGetMapObj



/**
    * @description 传入一个目录路径，将此路径下的所有docx文件批量转换为html文件
    * @param {Object} parObj 完整的参数对象信息
    * @param {String} parObj.dirPath 要处理目录路径，可传入绝对路径，也可传入相对路径
    * @param {String} parObj.outPath 要输出的html文档路径
    * @param {Boolean} parObj.isAddHtmlHead  是否给转换后的文档添加html,body等标签
    * @param {Boolean} parObj.isAddMenu   是否给转换后的html文件注入锚点菜单
    * @param {Boolean} parObj.autoHsSty   是否添加手动注入的h1--h6的大小样式
    * @param {Boolean} parObj.isAddOrder   是否添加手动生成的序号
    * @param {Boolean} parObj.isAddpagePadV   是否给页面注入默认的padding值
    * @param {Boolean} parObj.manualAssignment   用户手动注入的样式对象
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
        manualAssignment
    } = parObj;
    //获取指定路径下的所有docx文件
    let list = readFileList({
        dirPath: dirPath,
        ignoreList: ["node_modules", ".git"],
        needTypes: [".docx"],
    });


    //递归遍历对象数组，生成一个map对象
    let id2objMap = { 0: { children: list } };
    deepCallGetMapObj({ list, id2objMap, field: "id" });
    delEmptyDir(list, id2objMap);

    // 将空目录（即没有我需要的类型文件的目录）过滤掉
    function delEmptyDir(list, id2objMap) {
        for (let i = list.length - 1; i >= 0; i--) {
            let Obj = list[i];
            // 判断是否为文件
            if (!Obj.children) {  //children不存在，则认为是文件
                return;
            }
            else if (Obj.children && Obj.children.length == 0) {  //children存在，但为空，则认为是空目录
                let parent_id = Obj.parent_id;
                console.log("============删除空目录", JSON.stringify(Obj, null, 4))
                let index = list.indexOf(Obj);
                changFlag++;//表示变化了
                list.splice(index, 1);
                deepCall2Top(parent_id, id2objMap); // 每删完一次就查看父级的children数组是否为空，如果为空就把父级也删了
            }
            else if (Obj.children && Obj.children.length > 0) {  //children存在，且不为空
                filterEmptyDir(Obj.children, id2objMap);
            }

        }
    }

    // 递归向上查找，删除所有空的父级
    function deepCall2Top(parent_id, id2objMap) {
        if (parent_id == "0") return;//已经递归到最顶端了，结束
        //获取父级对象
        let parentObj = id2objMap[parent_id];
        // 记录父对象的父iD
        let parent_id2 = parentObj.parent_id;
        // 父级的父级对象
        let parent_parObj = id2objMap[parent_id2];
        // 如果父级对象的children已经为空，那么就删除此父级对象，同时在往上寻找
        if (parentObj.children.length == 0) {
            let index = parent_parObj.children.indexOf(parentObj)
            parent_parObj.children.splice(index, 1);
            changFlag++;//表示变化了
            // 同时递归调用自身，往上层查找
            deepCall2Top(parent_id2, id2objMap);
        }
    }
}

// export default batchDocx2html;

batchDocx2html({
    dirPath: "./"
})

// let extname = path.extname("1. vue一些补充知识点.docx");

// console.log("===extname====", extname, /\.\w+$/.test(extname));
