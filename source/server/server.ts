import * as http from "http";

const HTTP_PORT: number = Number(process.env.PORT) || 80;

http.createServer((req, res) => {
    if (req.url === '/h' || req.url === '/h/') {
        res.writeHead(200);
        res.end('Host Client');
    } else if (req.url === '/') {
        res.writeHead(200);
        res.end('Player Client');
    } else {
        res.writeHead(404);
        res.end('Not found.');
    }
}).listen(HTTP_PORT, () => {
    console.log("Started http server.")
    console.log("Host: http://localhost/h\nPlayer: http://localhost");
});