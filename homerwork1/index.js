const http = require('http');
const url = require('url');
const PORT = 3300;

const httpServer = http.createServer((req, res) => handleRequests(req, res));
httpServer.listen(PORT, () => console.log(`Server listen on port: ${PORT}`));

const handlers = {
    hello: (callback) => {
        callback(200, {message: 'hello world'});
    },
    notFound: (callback) => {
        callback(404);
    }
};
const router = {
    hello: handlers.hello
}
function handleRequests(req, res) {
    const parsedUrl = url.parse(req.url);
    const pathname = parsedUrl.pathname.replace(/^\/+|\/+$/g, '');
    const chosenHandler = router[pathname] ? router[pathname] : handlers.notFound;
    chosenHandler((statusCode, payload) => {
        statusCode = statusCode || 200;
        payload = payload || {};
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(statusCode);
        res.end(JSON.stringify(payload));
    });
}

