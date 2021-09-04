

/**
    * @description 将数字转换为英文字母，大于26的数字也可以，并可控制大写和小写
    * @param {number} i 要转换的阿拉伯数字
    * @param {boolean} big true:大写，false|不传:为小写
    * @author zl-fire 2021/09/01
    * @return {string} a-z英文字母
    * @example
    * let n=numToEng(1);//返回'a'
  */
function numToEng(i, big) {
  var s = "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z";
  // 默认小写（即没传big或big未false时，就为小写）
  if (!big) {
    s = s.toLocaleLowerCase();
  }
  var sArray = s.split(" ");
  if (i < 1) {
    return "";
  } else if (parseInt((i / 26) + "") == 0) {
    return sArray[i % 26 - 1];
  } else {
    if (i % 26 == 0) {
      return (transform(parseInt((i / 26) + "") - 1)) + sArray[26 - 1];
    } else {
      return sArray[parseInt((i / 26) + "") - 1] + sArray[i % 26 - 1];
    }
  }
}
export default numToEng