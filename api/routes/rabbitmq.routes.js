const controller = require('../controllers/rabbitmq.controller');
// const middlewares = require('../middlewares/index');

module.exports = function(app){
    app.use(function(req, res, next){
        res.header(
            "Access-Control-Allow-Headers", 
            "x-access-token, Origin, Content-Type, Accept"
        );

        next();
    });

    // app.get('/api/rabbitmq/stats', middlewares.checkJwt, controller.readQueueMetrics);
    app.get('/api/rabbitmq/stats', controller.readQueueMetrics);
}