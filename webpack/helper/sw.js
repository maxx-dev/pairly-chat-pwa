const fs = require("fs");
module.exports = (swPath,version) => {
    let sw = fs.readFileSync(swPath).toString();
    sw = sw.replace(new RegExp('SW-VERSION[^]+?SW-VERSION','g'),"SW-VERSION*/'"+version+"'/*SW-VERSION");
    fs.writeFileSync(swPath,sw);
};