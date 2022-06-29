const { elasticClient } = require('../config/elastic.config');
const { logger } = require('../utils/logger');

//CRUD Controllers for Workspaces configuration

//Create Workspace
const createWorkspace = async(req, res) => {
    if(!req.body){
        return res
                    .status(400)
                    .send({
                        message: 'Req.body is empty.'
                    });
    }

    try {
        await elasticClient.index({
            index: 'workspaces',
            body: req.body
        });

        res
            .status(200)
            .send({
                message: 'Workspace successfully saved.'
            });
    } catch (error) {
        logger.error('[WORKSPACES] - Error occured, while creating new workspace. ', error)
        res
            .status(500)
            .send({
                message: error
            })
    }
}

//Read Workspaces
const readWorkspaces = async(req, res) => {
    try {
        const data = await elasticClient.search({
            index: 'workspaces',
            body: {
                query: {
                    'match_all': {},
                }
            }
        })

        res
            .status(200)
            .send(data);

    } catch (error) {
        logger.error('[WORKSPACES] - Error occured while retrieving Workspaces. ', error)
        res
            .status(500)
            .send({
                message: error.message || 
                'Error occured while retrieving Workspaces.' 
            })
    }
}


//Read Workspace
const readWorkspaceById = async(req, res) => {
    if(!req.body){
        return res
                    .status(400)
                    .send({
                        message: 'Error: req.body is empty'
                    })
    }

    const id = req.params.id;

    try {
        const data = await elasticClient.get({
            index: 'workspaces',
            id: id,
        });

        if(!data){
            res
                .status(400)
                .send({
                    message: `Workspace with id ${id} not found...`
                })
        } else {
            res
                .status(200)
                .send(data);
        }
    } catch (error) {
        logger.error(`[WORKSPACES] - Error occured while retrieving Workspace with id: ${id}`, error)
        res
            .status(500)
            .send({
                message: error.message || 
                'Error occured while retrieving Workspace'
            })
    }

}

//Update Workspace
const updateWorkspace = async(req, res) => {
    if(!req.body){
        return res
                    .status(400)
                    .send({
                        message: 'Error: req.body is empty'
                    })
    }

    const id = req.params.id;

    try {
        const data = await elasticClient.update({
            index: 'workspaces',
            id: id,
            body: {
                doc: req.body.config,
            }
        });

        res
            .status(200)
            .send(data);

    } catch (error) {
        logger.error(`[WORKSPACES] - Error occured while updating Workspace with id: ${id}`, error)
        res
            .status(500)
            .send({
                message: error.message ||
                `Error: updating Workspace with id ${id}`
            });

    }
}

//Delete Workspace
const deleteWorkspace = async(req, res) => {
    if(!req.body){
        return res
                    .status(400)
                    .send({
                        message: 'Req.body is empty.'
                    });
    }

    try {
        const data = await elasticClient.delete({
            index: 'workspaces',
            id: req.body.id,
        });

        res
            .status(200)
            .send(data);
        
    } catch (error) {
        res
            .status(500)
            .send({
                message: error.message || 
                `Error occured while trying to delete workspace with id : ${req.body.id}`,
            })
    }
}


module.exports = {
    createWorkspace,
    readWorkspaces,
    readWorkspaceById,
    updateWorkspace,
    deleteWorkspace,
}