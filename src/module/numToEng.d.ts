export default numToEng;
/**
    * @description 将数字转换为英文字母，大于26的数字也可以，并可控制大写和小写
    * @param {number} i 要转换的阿拉伯数字
    * @param {boolean} big true:大写，false|不传:为小写
    * @author zl-fire 2021/09/01
    * @return {string} a-z英文字母
    * @example
    * let n=numToEng(1);//返回'a'
  */
declare function numToEng(i: number, big: boolean): string;
