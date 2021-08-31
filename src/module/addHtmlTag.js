// 如果内容没有外层的html，body包裹，则可使用此函数进行处理
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