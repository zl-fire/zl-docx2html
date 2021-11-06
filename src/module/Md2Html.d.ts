export default Md2Html;
/**
 * markdown文件转html页面
 * @constructor
 */
declare class Md2Html {
    constructor(fileName: any);
    fs: any;
    path: any;
    marked: any;
    fileName: any;
    /**
    * 将marked转换为html
    */
    md2html(): any;
}
