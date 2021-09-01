import numberToChinese from "./numberToChinese";


function deepCall(children, id2HsMap) {
    if (children && children.length > 0) {
        for (let i = 0; i < children.length; i++) {
            id2HsMap[children[i].eleId] = i + 1;
            // 修改标题（加上序号）
            let newName;
            if (children[i].tag == "h1" || children[i].tag == "H1") {
                newName = numberToChinese(i + 1) + ". " + children[i].name;
            }
            else {
                newName = i + 1 + ". " + children[i].name;
            }
            children[i].name = newName
            //递归调用
            deepCall(children[i].children, id2HsMap);
        }
    }
}

function addHsOrder($, list) {
    var id2HsMap = {};
    // 先给每个list标题编一个序号，id为键，序号为值
    deepCall(list, id2HsMap);

    // 然后在遍历所有标题，依次将序号写入进去
    let hs = $("h1,h2,h3,h4,h5,h6");
    for (let i = 0; i < hs.length; i++) {
        let tagName, text;
        try {
            windows;
            tagName = hs[i].tagName;
            text = hs[i].innerText;
        }
        catch {
            tagName = hs[i].name;
            text = $(hs[i]).text();

        }
        let eleId = $(hs[i]).prop("id");
        // 获取新的名字：序号+原名
        let newName;
        if (tagName == "h1" || tagName == "H1") {
            newName = numberToChinese(id2HsMap[eleId]) + ". " + text;
        }
        else newName = id2HsMap[eleId] + ". " + text;
        //向元素注入新的，名字
        $(hs[i]).text(newName);
    }
    return $.html();
}
export default addHsOrder


// let list=require("../../list.json");
// var id2HsMap = {};
// // 先给每个list标题编一个序号，id为键，序号为值
// deepCall(list,id2HsMap);
// console.log("====id2HsMap=====",id2HsMap)