import { elasticClient } from '../config/elastic.config.js';
import  { logger }  from "./logger.js";
import moment from 'moment';

export const readWorkspaceById = async (workspaceId) => {
    const id = workspaceId;
    let data;
    try {
        data = await elasticClient.get({
            index: 'workspaces',
            id: id,
        });
    } catch (error) {
        logger.error(`[WORKSPACES] - Error occured while retrieving Workspace with id: ${id}`, error)
    }

    return data

}

export const getKpis = async (workspaceId) => {
   
    let results = [];
    let productsScope, websitesScope;
    let crawlIndex;

    let isIndex = false;
    
    let i = 0;
    while (!isIndex) {
        //console.log("isIndex",isIndex);
        crawlIndex = `offer-crawling-raw_${moment().subtract(i, 'days').format('YYYY-MM-DD')}`;
        //console.log("crawlIndex",crawlIndex);
        try {
            isIndex = await elasticClient.indices.exists({
                index: crawlIndex,
            });
            //console.log("isIndex",isIndex);
        } catch (error) {
            console.log(error);
        }
        i++;
    }

    try {
        const data = await readWorkspaceById(workspaceId)
      
        productsScope = data._source.productsScope.split(", ");
        websitesScope = data._source.websitesScope.split(", ");
         console.log("websitesScope", websitesScope, typeof(websitesScope))
        for (let website of websitesScope) {
            for (let product of productsScope) {
                const data = await elasticClient.search({
                    index: crawlIndex,
                    body: {
                        query: {
                            bool: {
                                must: [
                                    {
                                        match: {
                                            "offer.code.keyword": product
                                        }
                                    },
                                    {
                                        match: {
                                            "offer.domain.keyword": website
                                        }
                                    }
                                ]
                            }
                        }
                    }
                })
                if (data.hits.hits.length > 0) {
                    const offer = data.hits.hits[0]._source.offer;
                    results.push(offer);
                }

            }
        }
        console.log("results")
        return results
    } catch (error) {
        console.log(error);
         return { error }
    }
}

