import config from "../config";

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
    background-color: #c5bcbc;
    height:97vh;
    /*  overflow: scroll;*/
    transition: all 1s;

}
</style>
  `;
    //先往body的最后面添加两个div，分别表示菜单按钮和菜单内容
    var anchorLinkDiv = '<div id="anchorLinkMenu">目录菜单</div><div id="anchorLinkContent">666</div>';
    // 控制多大后自动显示菜单
    let widSize = config.widSize;
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

        // 控制菜单点击后的样式

        function resizefn(){

            // 大于1000px 完整显示菜单，内容宽度由总宽度减去菜单宽度
            // 小于1000的，不显示菜单，宽度基本占满

            // 隐藏此菜单
            if(document.documentElement.clientWidth<${widSize}){
                anchorLinkContent.style.cssText = "right:-410px;"
                anchorLinkMene.onmouseenter = function () {
                    anchorLinkContent.style.cssText = "right:0;"
                }
                anchorLinkContent.onmouseleave = function () {
                    anchorLinkContent.style.cssText = "right:-410px;"
                }
            }
            // 显示此菜单
            else{
                anchorLinkContent.style.cssText = "right:0;"
                anchorLinkMene.onmouseenter=null;
                anchorLinkContent.onmouseleave=null;
                // 需要将内的宽度计算出来
                if($(".docx-body")[0]) $(".docx-body").width(document.documentElement.clientWidth-360);
                if($(".markdown-body")[0]) $(".markdown-body").width(document.documentElement.clientWidth-360)
            }
        }
        resizefn();//初始化执行一次
        window.onresize=function(){
            resizefn();
        }
        // 前5秒一直执行
        let tot = 0;
        let timer = setInterval(function () {
          resizefn();
        //   console.log("=======tot,", tot)
          tot += 200;
          if (tot >= 5000) {
            clearInterval(timer);
            tot = 0;
          }
        }, 200)
      
    }
    </script>
    `;
}

export default createEndMenuTempla