export default numToEng0_26;
/**
    * @description 通过ASCII码的方式将1-26转换为字母a-z(可大写可小写)
    * @param {number} num 要转换的阿拉伯数字1-26
    * @param {boolean} big true:大写，false|不传:为小写
    * @author zl-fire 2021/09/01
    * @return {string} 英文字母a-zA-Z
    * @example
    * let n=numToEng0_26(1);//返回'a'
  */
declare function numToEng0_26(num: number, big: boolean): string;
