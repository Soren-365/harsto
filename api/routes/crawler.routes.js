const controller = require('../controllers/crawler.controller');
// const middlewares = require('../middlewares/index');

module.exports = function(app){
    app.use(function(req, res, next){
        res.header(
            "Access-Control-Allow-Headers", 
            "x-access-token, Origin, Content-Type, Accept"
        );

        next();
    });

    // app.post('/api/crawler/debugger', middlewares.checkJwt, controller.publishMsgToQueue);
    app.post('/api/crawler/debugger', controller.publishMsgToQueue);

    // app.post('/api/crawler/debugger/read', middlewares.checkJwt, controller.readCrawlResults);
    app.post('/api/crawler/debugger/read', controller.readCrawlResults);
}