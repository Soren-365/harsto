const controller = require('../controllers/retailers.controller');
// const middlewares = require('../middlewares/index.js');

module.exports = function(app){
    app.use(function(req, res, next){
        res.header(
            "Access-Control-Allow-Headers", 
            "x-access-token, Origin, Content-Type, Accept"
        );

        next();
    });

    // app.post('/api/retailer/create', middlewares.checkJwt, controller.createRetailer);
    app.post('/api/retailer/create', controller.createRetailer);

    // app.get('/api/retailer/read/:id', middlewares.checkJwt, controller.readRetailerById);
    app.get('/api/retailer/read/:id', controller.readRetailerById);

    // app.get('/api/retailers/read', middlewares.checkJwt, controller.readRetailers);
    app.get('/api/retailers/read', controller.readRetailers);

    // app.put('/api/retailer/update/:id', middlewares.checkJwt, controller.updateRetailer);
    app.put('/api/retailer/update/:id', controller.updateRetailer);

    // app.post('/api/retailer/delete', middlewares.checkJwt, controller.deleteRetailer);
    app.post('/api/retailer/delete', controller.deleteRetailer);
}