/**
    * @description 如果内容没有外层的html，body包裹，则可使用此函数进行处理
    * @param {string} content 要处理的html字符串
    * @param {string} fileName html字符串的名字
    * @param {string} docType  原始文档类型，不传的话默认为doxc，可传如md
    * @author zl-fire 2021/09/01
    * @return {string} 包裹了html,body的最终的字符串
  */
function addHtmlTag(content, fileName, docType) {
    if (docType !== "md") {
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
    else {
        return `<!DOCTYPE html>
        <html>
            <head>
            <meta charset="utf-8" >
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>${fileName}</title>
            <script src="https://cdn.jsdelivr.net/npm/blogzl-indexjs@18.0.0/dist/jquery.min.js"></script>
            <style>
                .markdown-body {
                    box-sizing: border-box;
                    min-width: 200px;
                    width:80%;
                    float:left;
                    margin: 0 auto;
                    padding: 45px;
                }
                @media (max-width: 767px) {
                    .markdown-body {
                        padding: 15px;
                    }
                }
            </style>
            <link href="https://cdn.bootcss.com/github-markdown-css/4.0.0/github-markdown.min.css" rel="stylesheet">
            <link href="https://cdn.bootcss.com/highlight.js/9.12.0/styles/github-gist.min.css" rel="stylesheet">
            </head>
            <body>
                ${content}
            </body>
        </html>`;
    }

}
export default addHtmlTag