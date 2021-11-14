var path = require("path");
let outPath="./a/b/cc.png";
let fileName="cc"
let v=path.join(outPath, "../", fileName + "_imgs", fileName + Date.now() + '.png');
console.log(v)