const axios = require('axios');
const rabbitConfig = require('../config/rabbitmq.config.js');
const { logger } = require('../utils/logger');

const readQueueMetrics = async(req, res) => {
    if(!req.body){
        return res
                    .status(400)
                    .send({
                        message: 'Error: req.body is empty'
                    })
    }

    try {
        const data = await axios.get(`${rabbitConfig.api}/api/queues/%2F/crawler`);
        res
            .status(200)
            .send({
                rabbitMqQueueLength: data.data.backing_queue_status.len,
                rabbitMqQueueAckSpeedInMin: (data.data.backing_queue_status.len / data.data.message_stats.ack_details.rate)/60,
            });

    } catch (error) {
        logger.error('[RABBITMQ] - Error occured while retrieving RabbitMQ stats.', error);
        res
            .status(500)
            .send({
                message: 'Error occured while retrieving RabbitMQ stats...'
            })
    }

}

module.exports = {
    readQueueMetrics,
}