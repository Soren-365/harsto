const controller = require('../controllers/kpis.controller');

module.exports = function(app){
    app.use(function(req, res, next){
        res.header(
            "Access-Control-Allow-Headers", 
            "x-access-token, Origin, Content-Type, Accept"
        );

        next();
    });

    app.get('/api/kpis/read/', controller.getKpis);
}