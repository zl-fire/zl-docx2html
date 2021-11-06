export default createEndMenuTempla;
/**
    * @description 返回要创建固定定位的菜单容器字符串（固定格式），包含了html+css+js, 接收一个具体的菜单内容作为参数
    * @param {string} realMenu 菜单html字符串
    * @author zl-fire 2021/09/01
    * @return {string} 生成的最终的包含了样式和js逻辑的菜单字符串
  */
declare function createEndMenuTempla(realMenu: string): string;
