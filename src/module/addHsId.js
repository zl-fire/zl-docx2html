// 给页面的所有标题元素添加id属性，用于后面的锚点跳转
function addHsId($) {
    let hs = $("h1,h2,h3,h4,h5,h6");
    for (let i = 0; i < hs.length; i++) {
        let tagName;
        try {
            windows;
            tagName = hs[i].tagName;
        }
        catch {
            tagName = hs[i].name;
        }
        let eleId = $(hs[i]).prop("id");
        // console.log("===hs[i]====", tagName, eleId)
        //向元素注入id
        if (!eleId) $(hs[i]).prop("id", tagName + i);
    }
    return $.html();
}
export default addHsId