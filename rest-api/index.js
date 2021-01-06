/*
* Primary file for the API
*
*/

//Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');
const handlers = require('./lib/handlers');
const helpers = require('./lib/helpers');

const httpServer = http.createServer((req, res) => unifiedServer(req, res));
httpServer.listen(config.httpPort, () => {
    console.log(`Server listen on port ${config.httpPort}. Environment ${config.envName}`);
});

const httpsOptions = {
    key: fs.readFileSync('./https/key.pem'),
    cert: fs.readFileSync('./https/cert.pem')
};

const httpsServer = https.createServer(httpsOptions, (req, res) => unifiedServer(req, res));
httpsServer.listen(config.httpsPort, () => {
    console.log(`Server listen on port ${config.httpsPort}. Environment ${config.envName}`);
});

const router = {
    ping: handlers.ping,
    users: handlers.users
}

function unifiedServer(req, res) {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const trimmedPath = pathname.replace(/^\/+|\/+$/g, '');
    const method = req.method.toLowerCase();
    const queryStringObject = parsedUrl.query;
    const headers = req.headers;
    const decoder = new StringDecoder('utf-8');
    let payload = '';
    req.on('data', data => {
        payload += decoder.write(data);
    })

    req.on('end', () => {
        payload += decoder.end();

        const data = {
            trimmedPath,
            method,
            queryStringObject,
            headers,
            payload: helpers.parseJsonToObject(payload)
        };
        const chosenHandler = router[trimmedPath] ? router[trimmedPath] : handlers.notFound;

        chosenHandler(data, (statusCode, payload) => {
            statusCode = statusCode || 200;
            payload = payload || {};
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(JSON.stringify(payload));
            console.log('payload: ', payload);
        });
    })
}
