'use strict';

const fs = require('fs');
const path = require('path');
const http = require('http');

const connect = require('connect');
const app = connect();

// ENABLE CORS SUPPORT
var cors = require('cors');
app.use(cors());
//

const swaggerTools = require('swagger-tools');
const jsyaml = require('js-yaml');

const operations = require('./backend/operations');
const serverPort = process.env.PORT || 10010;

// swaggerRouter configuration
const options = {
  swaggerUi: path.join(__dirname, '/swagger.json'),
  controllers: path.join(__dirname, './controllers'),
  useStubs: process.env.NODE_ENV === 'development'
};

const initializeSwaggerMiddleware = function(swaggerDoc) {
    return new Promise(function (resolve) {
        swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {

            // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
            app.use(middleware.swaggerMetadata());

            // Validate Swagger requests
            app.use(middleware.swaggerValidator());

            // Route validated requests to appropriate controller
            app.use(middleware.swaggerRouter(options));

            // Serve the Swagger documents and Swagger UI
            app.use(middleware.swaggerUi());

            app.use('/', function rootHandler(req, res, next) {
                // there are lots of funny cases here such as /abcd1234
                // which could also be flagged so we mark / as the explicit
                // url and then we pass the rest through which should result in a
                // 404 error to the caller. Implitily this is not an error since it is
                // not defined as part of the API in swagger so we do it here to avoid
                // populating the API space with middleware specific issue.
                if (req.url === '/') {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", 'text/plain');
                    res.end('This is the root URL and does nothing. Please use /docs to see the API documentation and supported URLs');
                } else {
                    next();
                }
              });
            resolve();
        });
    });
};

const initializeHttpServer = function() {
    return new Promise(function (resolve) {
        http.createServer(app).listen(serverPort, function () {
            resolve();
        });
    });
};

function initializeSwaggerDoc() {
    return new Promise(function(resolve) {
        // The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
        const spec = fs.readFileSync(path.join(__dirname,'api/swagger.yaml'), 'utf8');
        const swaggerDoc = jsyaml.safeLoad(spec);

        resolve(swaggerDoc);
    });
}
operations.restoreData()
    .then(function() {
        return initializeSwaggerDoc();
    })
    .then(function(doc) {
        return initializeSwaggerMiddleware(doc);
    })
    .then(function() {
        return initializeHttpServer();
    })
    .then(function() {
        console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
        console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
    })
    .catch(function (error) {
        console.error(`Unable to initialize ${error.toString()}`);
        abort(-1);
    });
