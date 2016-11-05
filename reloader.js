var log = require('npmlog');
var fs = require('fs');

module.exports = function(fname) {

    if (!fs.existsSync(fname))
        return false;
    var fullname = require.resolve(fname);
    var res = new Object();

    fs.watchFile(fullname, function() {

        delete require.cache[fullname];
        res.handle = res.exports = require(fullname);
        log.warn("reload", fullname);

    });

    log.warn("load", fullname);
    res.handle = res.exports = require(fullname);
    return res;
}
