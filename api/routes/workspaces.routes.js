const controller = require('../controllers/workspaces.controller');
// const middlewares = require('../middlewares/index');

module.exports = function(app){
    app.use(function(req, res, next){
        res.header(
            "Access-Control-Allow-Headers", 
            "x-access-token, Origin, Content-Type, Accept"
        );

        next();
    });

    // app.post('/api/workspace/create', middlewares.checkJwt, controller.createWorkspace);
    app.post('/api/workspace/create', controller.createWorkspace);

    // app.get('/api/workspaces/read', middlewares.checkJwt, controller.readWorkspaces);
    app.get('/api/workspaces/read', controller.readWorkspaces);

    // app.get('/api/workspace/read/:id', middlewares.checkJwt, controller.readWorkspaceById);
    app.get('/api/workspace/read/:id', controller.readWorkspaceById);

    // app.put('/api/workspace/update/:id', middlewares.checkJwt, controller.updateWorkspace);
    app.put('/api/workspace/update/:id', controller.updateWorkspace);

    // app.post('/api/workspace/delete', middlewares.checkJwt, controller.deleteWorkspace);
    app.post('/api/workspace/delete', controller.deleteWorkspace);
}