import numberToChinese from "./numberToChinese";
import numToEng from "./numToEng";

// 先给每个list标题编一个序号，在给所有的id一致的标题注入这个序号
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
        let newName = handOrder({ tagName, text, id2HsMap, eleId });
        //向元素注入新的，名字
        $(hs[i]).text(newName);
    }
    return $.html();
}

function deepCall(children, id2HsMap) {
    if (children && children.length > 0) {
        for (let i = 0; i < children.length; i++) {
            id2HsMap[children[i].eleId] = i + 1;
            // 修改标题（加上序号）
            let tagName = children[i].tag;
            let text = children[i].name;
            let orderNum = i + 1;
            let newName = handOrder({ tagName, text, orderNum });
            children[i].name = newName
            //递归调用
            deepCall(children[i].children, id2HsMap);
        }
    }
}

function handOrder({ tagName, text, id2HsMap, eleId, orderNum }) {
    // 获取新的名字：序号+原名
    if (!orderNum) orderNum = id2HsMap[eleId];
    let newName;
    if (tagName == "h1" || tagName == "H1") {
        newName = numberToChinese(orderNum) + ". " + text;//格式:一. 
    }
    else if (tagName == "h2" || tagName == "H2") { //格式:(一).
        newName = "(" + numberToChinese(orderNum) + "). " + text;
    }
    else if (tagName == "h3" || tagName == "H3") { //格式:1). 
        newName = orderNum + "). " + text;
    }
    else if (tagName == "h4" || tagName == "H4") {//格式:(1). 
        newName = "(" + orderNum + "). " + text;
    }
    else if (tagName == "h5" || tagName == "H5") { //格式:A. 
        newName = numToEng(orderNum, true) + ". " + text;
    }
    else { 
        newName = numToEng(orderNum) + ". " + text; //格式:a. 
    }
    return newName;
}


export default addHsOrder
