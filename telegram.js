const fs = require("fs");

var iplist = [];

module.exports = {
    loadIPList(path) {
        "use strict";
        if (!fs.existsSync(path)) {
            throw new Error("telegarm IP段文件不存在.");
        }
        iplist = [];
        var iplistFileContent = fs.readFileSync(path).toString();
        for (let ipRange of iplistFileContent.split("\n")) {
            ipRange = ipRange.trim();
            var ip = ipRange.substring(0, ipRange.indexOf("/"));
            var ipArray = new Buffer(ip.split("."));
            if (ipArray.length !== 4) continue;
            var ipLong = ipArray.readInt32BE(0);
            var netmask = parseInt(ipRange.substring(ipRange.indexOf("/") + 1, ipRange.length));
            var range = 2 << (32 - netmask - 1);
            iplist.push({
                start: ipLong,
                end: ipLong + range
            })
        }
    },

    isTelegramIP(str) {
        var ipArray = new Buffer(str.split("."));
        var ipLong = ipArray.readInt32BE(0);
        for (var range of iplist) {
            if (ipLong >= range.start && ipLong <= range.end) {
                return true;
            }
        }
        return false;
    }
};
