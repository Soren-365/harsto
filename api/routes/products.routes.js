const controller = require('../controllers/products.controller');
// const middlewares = require('../middlewares/index');

module.exports = function(app){
    app.use(function(req, res, next){
        res.header(
            "Access-Control-Allow-Headers", 
            "x-access-token, Origin, Content-Type, Accept"
        );

        next();
    });

    // app.post('/api/product/create', middlewares.checkJwt, controller.createProduct);
    app.post('/api/product/create', controller.createProduct);

    // app.post('/api/products/csvimport', middlewares.checkJwt, controller.csvImport);
    app.post('/api/products/csvimport', controller.csvImport);

    // app.get('/api/product/read/:code', middlewares.checkJwt, controller.readProductByCode);
    app.get('/api/product/read/:code', controller.readProductByCode);

    // app.get('/api/products/read', middlewares.checkJwt, controller.readProducts);
    app.get('/api/products/read', controller.readProducts);

    // app.put('/api/product/update/:id', middlewares.checkJwt, controller.updateProduct);
    app.put('/api/product/update/:id', controller.updateProduct);
}