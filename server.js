const argv = require("optimist")
            .usage("Usage: $0 --port [listen port]")
            .demand(["port"])
            .argv;
const socks5 = require("./lib");
const telegarm = require("./telegram");

const server = socks5.createServer();
telegarm.loadIPList("./telegramip.txt");

server.on("proxyConnect", function (info, targetSocket, clientSocket) {
    var ip = info.host;
    var log = `${clientSocket.remoteAddress} <-> ${ip}:${info.port}`;
    if (!isIP(ip)) {
        targetSocket.destroy();
        console.log(log, "reject");
        return;
    }
    if (!telegarm.isTelegramIP(ip)) {
        targetSocket.destroy();
        console.log(log, "reject");
        return;
    }
    console.log(log, "connect");
});

server.on("proxyError", function (err) {
    console.error("unable to connect to remote server:", err.message);
});

function isIP(str) {
    var ipArray = str.split(".");
    if (ipArray.length != 4) return false;
    for (var item of ipArray) {
        item = parseInt(item);
        if (isNaN(item)) return false;
        if (item >= 1 && item <= 254) continue;
        return false;
    }
    return true;
}

server.listen(argv.port);
console.log(`Listening on port ${argv.port}.`);