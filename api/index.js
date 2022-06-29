require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Elastic = require('./config/elastic.config');
const { elasticClient } = require('./config/elastic.config');
const { logger } = require('./utils/logger.js');
const Crawler = require('./controllers/crawler.controller');
const Scheduler = require('./controllers/scheduler.controller');


const app = express();

app.use(cors({ origin: '*' }));
app.use(bodyParser({ limit: '50mb' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Routes
require('./routes/retailers.routes')(app);
require('./routes/workspaces.routes')(app);
require('./routes/products.routes')(app);
require('./routes/crawler.routes')(app);
require('./routes/rabbitmq.routes')(app);

//Elasticsearch initialization
const elasticInitialization = async() => {
    try {
        await elasticClient.ping();
        console.log('[ELASTICSEARCH]: 🟢 Successfully connected.');
        await Elastic.setup();
        console.log('[ELASTICSEARCH]: 🟢 Successfully setup.');
    } catch (error) {
        console.log(error);
        logger.error('[ELASTICSEARCH]: Error connecting to Elasticsearch...', error);
    }
}

elasticInitialization();

app.get('/', (req, res) => {
    res.json("🟢 Server ON 🟢")
});

app.listen(process.env.API_PORT, () => {
    console.log(`[SERVER]: 🟢 Server is listening on port ${process.env.API_PORT} 🦄🎉🥳`)
});


Crawler.consumeQueue('debugger');   //Crawler dedicated to Debugger Queue
Crawler.consumeQueue('crawler');    //Crawler dedicated to Crawler Queue
Scheduler.launchCron();             //CRON scheduler