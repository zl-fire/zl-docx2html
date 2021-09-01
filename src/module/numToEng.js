function numToEng(num,big) {
    // 默认转换为小写
    if(!big){
      return String.fromCharCode(64 + parseInt(num) + 32);
    }
    else{
        // 转换为大写
        String.fromCharCode(64 + parseInt(num));
    }
}
export default numToEng