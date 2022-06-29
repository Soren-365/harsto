const { elasticClient } = require('../config/elastic.config');
const { logger } = require('../utils/logger');

//CRUD Controllers for Retailers configuration

//Create New Retailer
const createRetailer = async(req, res) => {
    if(!req.body){
        return res
                    .status(400)
                    .send({
                        message: 'Error: req.body is empty'
                    })
    }

    try {

        await elasticClient.index({
            index: 'retailers',
            body: req.body,
        })

        res
            .status(200)
            .send({
                message: `Retailer saved: ${req.body}`
            })
        
    } catch (error) {
        console.log('Error while creating new retailer: ', error);
        res
            .status(500)
            .send({
                message: error
            })
    }
}

//Read Retailer using ID
const readRetailerById = async(req, res) => {
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
            index: 'retailers',
            id: id,
        });

        if(!data){

            res
                .status(404)
                .send({
                    message: `Retailer with id ${id} not found...`
                })

        } else {
            res
                .status(200)
                .send(data)   
        }

    } catch (error) {
        res
            .status(500)
            .send({
                message: error.message || 
                'Error occured while retrieving Retailer'
            })
    }
}

//Read Retailer using URL
const readRetailerByUrl = async(url) => {
    const urlObject = new URL(url);
    const hostname = urlObject.hostname.replace('www.','');

    try {
        const data = await elasticClient.search({
            index: 'retailers',
            body: {
                query: {
                    match: {
                        hostname: hostname,
                    }
                }
            }
        })

        if(data.hits.hits.length > 0){
            return data.hits.hits[0]._source;
        } else {
            logger.error(`[ELASTICSEARCH] Error: could not retrieve retailer with url ${url}`, error);
        }
    } catch (error) {
        logger.error(`[ELASTICSEARCH] Error: could not retrieve retailer with url ${url}`, error);
    }
}

//Read Retailers
const readRetailers = async(req, res) => {
    try {
        const data = await elasticClient.search({
            index: 'retailers',
            from: 0,
            size: 1000,
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
        res
            .status(500)
            .send({
                message: 
                    error.message || 
                    'Error: could not retrieve all retailers.' 
            })
    }
}

//Update Retailer
const updateRetailer = async(req, res) => {
    if(!req.body){
        return res
                    .status(400)
                    .send({
                        message: 'Error: req.body is empty'
                    })
    }

    try {
        const data = await elasticClient.update({
            index: 'retailers',
            id: req.params.id,
            body: {
                doc: req.body.config,
            }
        })

        res
            .status(200)
            .send(data);

    } catch (error) {

        res
            .status(500)
            .send({
                message: error.message ||
                `Error: updating Retailer with id ${req.params.id}`
            })

    }
}


//Delete Retailer
const deleteRetailer = async(req, res) => {
    if(!req.body){
        return res
                    .status(400)
                    .send({
                        message: 'Error: req.body is empty'
                    })
    }

    

    try {
        const data = await elasticClient.delete({
            index: 'retailers',
            id: req.body._id,
        })

        res
            .status(200)
            .send(data);

    } catch (error) {
        res
            .status(500)
            .send({
                message: error.message || 
                `Error occured while deleting retailer id ${req.body._id}`
            })
    }
}


//CRUD
module.exports = {
    createRetailer,
    readRetailerById,
    readRetailerByUrl,
    readRetailers,
    updateRetailer,
    deleteRetailer,
}