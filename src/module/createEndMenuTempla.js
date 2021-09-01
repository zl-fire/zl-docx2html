/**
    * @description 返回要创建固定定位的菜单容器字符串（固定格式），包含了html+css+js, 接收一个具体的菜单内容作为参数
    * @param {string} realMenu 菜单html字符串
    * @author zl-fire 2021/09/01
    * @return {string} 生成的最终的包含了样式和js逻辑的菜单字符串
  */
function createEndMenuTempla(realMenu) {
    //设置相关样式
    var anchorLinkDivStyle = `
<style>
#anchorLinkMenu{
     color:blue;
     position:fixed;
     top:5px;
     right: 10px;
     padding:10px;
     border-radius:5px;
     box-shadow: 1px 1px 5px;
     cursor: pointer;
     opacity: 0.4;
    }
 #anchorLinkMenu:hover{
    opacity: 1;
}
#anchorLinkContent {
    opacity: 1;
    padding: 5px;
   /* width: 400px; */
    position: fixed;
    box-shadow: 1px 1px 5px;
    border-radius: 10px 0 0 10px;
    top:5px;
    right: -410px;
    background-color: white;
    height:97vh;
    /*  overflow: scroll;*/
    transition: all 1s;

}
</style>
  `;
    //先往body的最后面添加两个div，分别表示菜单按钮和菜单内容
    var anchorLinkDiv = '<div id="anchorLinkMenu">目录菜单</div><div id="anchorLinkContent">666</div>';
    return anchorLinkDivStyle + `
    <script>
    createRightMenu();
    function createRightMenu() {
        //插入div和相关样式
        document.querySelector("body").innerHTML += '${anchorLinkDiv}';
        //绑定div按钮的点击事件
        var anchorLinkMene = document.querySelector("#anchorLinkMenu");
        var anchorLinkContent = document.querySelector("#anchorLinkContent");

        //给div菜单内容添加实际内容
        // var realMenu = document.querySelector("#" + realMenuId);
        // anchorLinkContent.appendChild(realMenu.cloneNode(true));
        $(anchorLinkContent).html(\`${realMenu}\`);
    
        // anchorLinkMene.onclick = function () {
        //     anchorLinkContent.style.cssText = "right:0;";
        // };
        // //当点击了具体的内容菜单后，隐藏此菜单
        // anchorLinkContent.onclick = function () {
        //     anchorLinkContent.style.cssText = "right:-410px;";
        // };

        anchorLinkMene.onmouseenter = function () {
            anchorLinkContent.style.cssText = "right:0;"
        }
        anchorLinkContent.onmouseleave = function () {
            anchorLinkContent.style.cssText = "right:-410px;"
        }
    }
    </script>
    `;
}

export default createEndMenuTempla