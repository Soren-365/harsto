const { logger } = require('../utils/logger');
const moment = require('moment');
const { elasticClient } = require('../config/elastic.config');
const cheerio = require('cheerio');
const parsePrice = require('parse-price');

class Offer {
    constructor(){
        this.offer = {
            isOffer: '',
            language: '',
            code: '',
            image: '',
            title: '',
            brand: '',
            availability: '',
            priceCurrent: '',
            priceMap: '',
            priceDiscount: '',
            description: '',
            reviewsScore: '',
            reviewsNumber: '',
            link: '',
            domain: '',
            lastCrawl: '',
            statusCode: '',
        }
    }
};

const saveOffer = async(offer) => {
    if(!offer){
        logger.error('[Offers Controller > saveOffer]: Offer cannot be empty...');
        return;
    }

    const now = moment().format('YYYY-MM-DD');

    const isIndex = await elasticClient.indices.exists({
        index: `offer-crawling-raw_${now}`,
    })

    if(!isIndex){
        try {
            await elasticClient.indices.create({
                index: `offer-crawling-raw_${now}`,
            });

            console.log('index created...')
        } catch (error) {
            console.log('error while creating index')
            logger.error('[OFFERS CONTROLLER > saveOffer] - Error occured while trying to create indices...', error);
        } 
    }

    try {
        let query = await elasticClient.search({
            index: `offer-crawling-raw_${now}`,
            body: {
                query: {
                    term: {
                        'offer.link.keyword': offer.offer.link.href,
                    }
                }
            }
        });

        if(query.hits.hits.length > 0){
            await elasticClient.update({
                index: `offer-crawling-raw_${now}`,
                id: query.hits.hits[0]._id,
                body: {
                    doc: {
                        offer: offer.offer,
                    }
                }
            })
        } else {
            await elasticClient.index({
                index: `offer-crawling-raw_${now}`,
                refresh: true,
                body: offer,
            })
        }
    } catch (error) {
        logger.error('[Offers Controller > saveOffer]: Offer could not be saved...', error);
    }
}

const parseOffer = async(body, retailerConfig, url) => {
    let offer = new Offer;
    offer.offer.link = new URL(url);
    offer.offer.domain = offer.offer.link.hostname.replace('www.', '');
    offer.offer.isOffer = false;

    try {
        if(body){
            const $ = cheerio.load(body);
            const results = Object.entries(offer.offer);
            const selectors = Object.entries(retailerConfig.selectors);
            for(result of results){
                for(selector of selectors){
                    if(selector[0] === 'isOffer'){
                        const temp = $(selector[1].selector).text();
                        if(temp){
                            offer.offer.isOffer = true;
                        }
                    }
                    if(offer.offer.isOffer && selector[0] != 'isOffer'){
                        if(selector[0] === result[0]){
                            if(selector[1].selector){
                                if(!selector[1].property){
                                    offer.offer[result[0]] = $(selector[1].selector).text() ? $(selector[1].selector).text() : '';
                                } else {
                                    offer.offer[result[0]] = $(selector[1].selector).attr(selector[1].property) ? $(selector[1].selector).attr(selector[1].property) : '';
                                }
                            }
        
                            if(offer.offer[result[0]] && selector[1].regex.method != ''){
                                const regex = new RegExp(selector[1].regex.regex, 'gm');
                                switch(selector[1].regex.method){
                                    case 'replace':
                                        offer.offer[result[0]] = offer.offer[result[0]].replace(regex, '');
                                        break;
                                    
                                    case 'exec':
                                        if(selector[1].regex.group != ''){
                                            offer.offer[result[0]] = regex.exec(offer.offer[result[0]])[parseInt(selector[1].regex.group)];
                                        } else {
                                            offer.offer[result[0]] = regex.exec(offer.offer[result[0]])[0];
                                        }
                                        break;
                                }
                            }
                        }   
                    }             
                }
            }   
        }
    } catch (error) {
        logger.error(`[OFFERS CONTROLLER > parseOffer] - Error occured while parsing offer crawled from ${url} - ${error}`);
    }
    
    if(!offer.offer.priceMap){
        offer.offer.priceMap = offer.offer.priceCurrent;
    }
    
    offer.offer.lastCrawl = moment().format();

    return offer;
}

const cleanPrice = (offer) => {
    try {
        if(offer.offer.isOffer){
            const fields = ['priceCurrent', 'priceMap'];
            const items = Object.entries(offer.offer);
            for(item of items){
                for(field of fields){
                    if(item[0] === field){
                        offer.offer[item[0]] = parseFloat(parsePrice(offer.offer[item[0]]).toFixed(2));
                    }
                }
            }
        }
    } catch (error) {
        logger.error('[OFFERS CONTROLLER > cleanPrice] - Error occured while trying to clean prices...', error);
    }
    
    return offer;
}

const trimOffer = (offer) => {

    try {
        if(offer.offer.isOffer){
            const fieldsToClean = [ 
                'language', 
                'code', 
                'title', 
                'brand', 
                'availability', 
                'description',
            ]
        
            const items = Object.entries(offer.offer);
            for(item of items){
                for(field of fieldsToClean){
                    if(item[0] === field){
                        offer.offer[item[0]] = removeDoubleSpaces(offer.offer[item[0]]);
                        offer.offer[item[0]] = offer.offer[item[0]].trim();
                        offer.offer[item[0]] = offer.offer[item[0]].replace(/(\r\n|\n|\r)/gm, "");
                    }
                }
            }
        }
    } catch (error) {
        logger.error('[OFFERS CONTROLLER > trimOffer] - Error occured while trying to trim offer...', error);
    }
    
    return offer;
}

const removeDoubleSpaces = (text) => {
    while(text.indexOf('  ') > -1){
        text = text.replace('  ', ' ');
    }
    return text;
}

const parseAvailability = (offer) => {
    try {
        if(offer.offer.isOffer){

        }
        if(offer.offer.priceCurrent.length < 1){
            offer.offer.availability = false;
        } else if (offer.offer.isOffer){
            if(offer.offer['availability']){
                offer.offer.availability = true;
            } else {
                offer.offer.availability = false;
            }
        }
    } catch (error) {
        console.log('Error occured while parsing availability field...', error);
    }
    return offer;
}

const parseDiscount = (offer) => {
    try {
        if(offer.offer.isOffer){
            if(offer.offer.priceCurrent && offer.offer.priceMap){
                offer.offer.priceDiscount = parseFloat(((offer.offer.priceCurrent / offer.offer.priceMap ) - 1).toFixed(2));
            }
        }
    } catch (error) {
        console.log('Error occured while computing discount...', error);
    }
    
    return offer;
}

const getCode = async(offer) => {
    try {
        if(!offer.offer.code){
            const data = await elasticClient.search({
                index: 'products',
                body: {
                    query: {
                        nested: {
                            path: 'matches',
                            query: {
                                term: {
                                    'matches.url': offer.offer.link.href,
                                }
                            }
                        }
                    }
                }
            });
            if(data.hits.hits.length != 0){
                offer.offer.code = data.hits.hits[0]._source.code;
            }
        }  
    } catch (error) {
        console.log('Error occured while retrieving Code...', error);
    }
      
    return offer;
}

module.exports = {
    Offer,
    saveOffer,
    parseOffer,
    cleanPrice,
    trimOffer,
    parseAvailability,
    parseDiscount,
    getCode,
}