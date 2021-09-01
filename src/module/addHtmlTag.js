/**
    * @description 如果内容没有外层的html，body包裹，则可使用此函数进行处理
    * @param {string} content 要处理的html字符串
    * @param {string} fileName html字符串的名字
    * @author zl-fire 2021/09/01
    * @return {string} 包裹了html,body的最终的字符串
  */
function addHtmlTag(content, fileName) {
    return `
    <!DOCTYPE html>
<html lang="zh-cn">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${fileName}</title>
    <script src="https://cdn.jsdelivr.net/npm/blogzl-indexjs@18.0.0/dist/jquery.min.js"></script>
</head>
<body>
    ${content}
</body>
</html>
    `;
}
export default addHtmlTag