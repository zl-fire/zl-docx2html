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
export default resolveHtmlPageMenu;