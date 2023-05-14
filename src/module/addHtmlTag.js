
import config from "../config";
let { widSize } = config;

/**
    * @description 如果内容没有外层的html，body包裹，则可使用此函数进行处理
    * @param {string} content 要处理的html字符串
    * @param {string} fileName html字符串的名字
    * @param {string} docType  原始文档类型，不传的话默认为doxc，可传如md
    * @param {string} adsContent  要添加的广告脚本,默认为空
    * @author zl-fire 2021/09/01
    * @return {string} 包裹了html,body的最终的字符串
  */
function addHtmlTag(content, fileName, docType, adsContent = "") {

    // 大于1000px 完整显示菜单，内容宽度由总宽度减去菜单宽度
    // 小于1000的，不显示菜单，宽度基本占满

    if (docType !== "md") {
        return `
        <!DOCTYPE html>
    <html lang="zh-cn">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${fileName}</title>
        <script src="https://gcore.jsdelivr.net/npm/blogzl-indexjs@18.0.0/dist/jquery.min.js"></script>
        ${adsContent}
        <style>
        /*  控制docx文档显示的主体内容的位置，左右panddinf等 */
        .docx-body {
            box-sizing: border-box;
            min-width: 200px;
            width:80%;
            float:left;
            margin: 0 auto;
            padding: 25px;
        }
        .docx-body img {
            max-width: 100%;
        }
        @media (max-width: ${widSize}px) {
            .docx-body {
                padding: 15px;
                width: 100% !important;;
            }
            #anchorLinkMenu {
                writing-mode: vertical-rl;
                top: -5px !important;
                right: -2px !important;
                padding: 5px !important;
            }
        }
    </style>
    </head>
    <body>
        ${content}
    </body>
    </html>
        `;
    }
    if (docType !== "docx") {
        return `<!DOCTYPE html>
        <html lang="zh-cn">
            <head>
            <meta charset="utf-8" >
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>${fileName}</title>
            <script src="https://gcore.jsdelivr.net/npm/blogzl-indexjs@18.0.0/dist/jquery.min.js"></script>
            ${adsContent}
            <style>
              /*  控制md文档显示的主体内容的位置，左右panddinf等 */
                .markdown-body {
                    box-sizing: border-box;
                    min-width: 200px;
                    width:80%;
                    float:left;
                    margin: 0 auto;
                    padding: 25px;
                }
                @media (max-width: ${widSize}px) {
                    .markdown-body {
                        padding: 15px;
                        width: 100% !important;
                    }
                    #anchorLinkMenu {
                        writing-mode: vertical-rl;
                        top: -5px !important;
                        right: -2px !important;
                        padding: 5px !important;
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