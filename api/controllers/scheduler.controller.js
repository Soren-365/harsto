const moment = require('moment');
const { elasticClient } = require('../config/elastic.config');
const cron = require('node-cron');
const crawler = require('./crawler.controller.js');
const { logger } = require('../utils/logger');

const readWorkspacesToCrawl = async(timeRange) => {
    let workspacesIdToCrawl;
    try {
        workspacesIdToCrawl = await elasticClient.search({
            body: {
                query: {
                    bool: {
                        must: [
                            {
                                match: {
                                    'status': 'on',
                                }
                            },
                            {
                                range: {
                                    'nextCrawl': {
                                        gte: timeRange.start,
                                        lte: timeRange.end,
                                        time_zone: '+02:00',
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        })
    } catch (error) {
        console.log('Error occured while searching to schedule crawling... ')
    }
    return workspacesIdToCrawl;
}

const readUrls = async(code, hostname) => {
    let data;
    try {
        data = await elasticClient.search({
            index: 'products',
            body: {
                query: {
                    bool: {
                        must: [
                            {
                                term: {
                                    code: code,
                                }
                            },
                            {
                                nested: {
                                    path: 'matches',
                                    query: {
                                        bool: {
                                            must: [
                                                {
                                                    match: {
                                                        'matches.hostname': hostname,
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        });
    } catch (error) {
        logger.error('[SCHEDULER] - Error occured while searching for daily batch urls...', error)
    }
    return data;
}


const defineAndUpdateNextCrawl = async(workspace) => {
    switch(workspace._source.frequency){
        case 'daily':
            workspace._source.nextCrawl = moment(workspace.nextCrawl).add(1, 'days').format();
            break;
        
        case 'weekly':
            workspace._source.nextCrawl = moment(workspace.nextCrawl).add(1, 'weeks').format();
            break;

        case 'monthly':
            workspace._source.nextCrawl = moment(workspace.nextCrawl).add(1, 'months').format();
            break;
    }
    await updateWorkspace(workspace);
    logger.info('[SCHEDULER] - INFO: Workspace updated.')
}

const updateWorkspace = async(workspace) => {
    if(!workspace){
        logger.error('[SCHEDULER] - Error: workspace could not be updated since workspace is empty...')
        return
    }

    try {
        await elasticClient.update({
            index: 'workspaces',
            id: workspace._id,
            body: {
                doc: workspace._source
            }
        })
    } catch (error) {
        logger.error(`[SCHEDULER] - Error occured while updating workspace: ${workspace._id}`, error);
    }
}



const generateBatchOfTheDay = async() => {
    //defining today's time range
    const timeRange = {
        start: new Date(moment().startOf('day').format()),
        end: new Date(moment().endOf('day').format()),
    }

    //filter workspaces requiring today's crawling
    const workspaces = await readWorkspacesToCrawl(timeRange);
    
    //define next crawl date && update each filtered workspaces in ES (with updated nextCrawl date)
    for(workspace of workspaces.hits.hits){
        await defineAndUpdateNextCrawl(workspace);
    }

    let dailyBatchRaw = [];

    for(workspace of workspaces.hits.hits){
        for(code of workspace._source.productsScope){
            for(website of workspace._source.websitesScope){
                const data = await readUrls(code, website);
                if(data.hits.hits.length > 0){
                    for(match of data.hits.hits[0]._source.matches){
                        if(match.hostname === website){
                            dailyBatchRaw.push(match.url);
                        }
                    }
                }
            }
        }
    }
    
    //remove duplicated urls
    let dailyBatchUniq = new Set(dailyBatchRaw);
    dailyBatchUniq = [...dailyBatchUniq];

    // //define next crawl date && update each filtered workspaces in ES (with updated nextCrawl date)
    // for(workspace of workspaces.hits.hits){
    //     await defineAndUpdateNextCrawl(workspace);
    // }

    return dailyBatchUniq;
}

const launchCron = async() => {
    cron.schedule('*/10 * * * * *', async() => {
        try {
            const dailyBatchUniq = await generateBatchOfTheDay();
            if(dailyBatchUniq.length > 0){
                for(msg of dailyBatchUniq){
                    const job = {
                        msg: msg,
                        queueName: 'crawler',
                    }
                    await crawler.publishMsgToQueue(job);
                }
            } else {
                console.log('🥳 Job is done for today!');
            }
        } catch (error) {
            logger.error('[SCHEDULER] - Error occured while scheduling batch of the day');
        }
    })
}

module.exports = {
    launchCron: launchCron,
}