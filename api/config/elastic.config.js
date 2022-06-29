//Setup of 3 indices: Retailers, Workspaces, and Products //
const { Client } = require('@elastic/elasticsearch');

//Connection Client
const elasticClient = new Client({
    node: `http://${process.env.ELASTIC_HOST}:${process.env.ELASTIC_PORT}`,
    requestTimeout: process.env.ELASTIC_TIMEOUT,
    auth: {
        username: process.env.ELASTIC_USERNAME,
        password: process.env.ELASTIC_PASSWORD,
    }
});


//Checking if an index exists in ElasticSearch
const checkIndex = async(indexName) => {    
    try {
        const check = await elasticClient.indices.exists({
            index: indexName,
        });

        return check;
    } catch (error) {
        console.log(`Error occured while checking if ${indexName} exists`, error);
    }
}

//Retailers index setup
const initializeRetailersIndex = async() => {
    const check = await checkIndex('retailers');
    if(!check){
        await elasticClient.indices.create({
            index: 'retailers',
            body: {
                mappings: {
                    dynamic: 'false',
                    properties: {

                        name:       { type: 'text' },
                        hostname:   { type: 'keyword' },
                        discovery:  { type: 'text' },
                        extraction: { type: 'text' },
                        proxies: { type: 'boolean' },
                        selectors: { type: 'nested', 
                            properties: {
                                isOffer: { type: 'nested', 
                                    properties: {
                                        selector: { type: 'text' },
                                        property: { type: 'text' },
                                        regex: { type: 'nested', 
                                            properties: {
                                                regex: { type : 'text' },
                                                method: { type : 'text' },
                                                group: { type : 'integer' },
                                            }},
                                    }
                                },
                                language: { type: 'nested', 
                                    properties: {
                                        selector: { type: 'text' },
                                        property: { type: 'text' },
                                        regex: { type: 'nested', 
                                            properties: {
                                                regex: { type : 'text' },
                                                method: { type : 'text' },
                                                group: { type : 'integer' },
                                            }},
                                    }
                                },
                                code: { type: 'nested', 
                                    properties: {
                                        selector: { type: 'text' },
                                        property: { type: 'text' },
                                        regex: { type: 'nested', 
                                            properties: {
                                                regex: { type : 'text' },
                                                method: { type : 'text' },
                                                group: { type : 'integer' },
                                            }},
                                    }
                                },
                                image: { type: 'nested', 
                                    properties: {
                                        selector: { type: 'text' },
                                        property: { type: 'text' },
                                        regex: { type: 'nested', 
                                            properties: {
                                                regex: { type : 'text' },
                                                method: { type : 'text' },
                                                group: { type : 'integer' },
                                            }},
                                    }
                                },
                                title: { type: 'nested', 
                                    properties: {
                                        selector: { type: 'text' },
                                        property: { type: 'text' },
                                        regex: { type: 'nested', 
                                            properties: {
                                                regex: { type : 'text' },
                                                method: { type : 'text' },
                                                group: { type : 'integer' },
                                            }},
                                    }
                                },
                                brand: { type: 'nested', 
                                    properties: {
                                        selector: { type: 'text' },
                                        property: { type: 'text' },
                                        regex: { type: 'nested', 
                                            properties: {
                                                regex: { type : 'text' },
                                                method: { type : 'text' },
                                                group: { type : 'integer' },
                                            }},
                                    }
                                },
                                availability: { type: 'nested', 
                                    properties: {
                                        selector: { type: 'text' },
                                        property: { type: 'text' },
                                        regex: { type: 'nested', 
                                            properties: {
                                                regex: { type : 'text' },
                                                method: { type : 'text' },
                                                group: { type : 'integer' },
                                            }},
                                    }
                                },
                                priceCurrent: { type: 'nested', 
                                    properties: {
                                        selector: { type: 'text' },
                                        property: { type: 'text' },
                                        regex: { type: 'nested', 
                                            properties: {
                                                regex: { type : 'text' },
                                                method: { type : 'text' },
                                                group: { type : 'integer' },
                                            }},
                                    }
                                },
                                priceMap: { type: 'nested', 
                                    properties: {
                                        selector: { type: 'text' },
                                        property: { type: 'text' },
                                        regex: { type: 'nested', 
                                            properties: {
                                                regex: { type : 'text' },
                                                method: { type : 'text' },
                                                group: { type : 'integer' },
                                            }},
                                    }
                                },
                                priceDiscount: { type: 'nested', 
                                    properties: {
                                        selector: { type: 'text' },
                                        property: { type: 'text' },
                                        regex: { type: 'nested', 
                                            properties: {
                                                regex: { type : 'text' },
                                                method: { type : 'text' },
                                                group: { type : 'integer' },
                                            }},
                                    }
                                },
                                description: { type: 'nested', 
                                    properties: {
                                        selector: { type: 'text' },
                                        property: { type: 'text' },
                                        regex: { type: 'nested', 
                                            properties: {
                                                regex: { type : 'text' },
                                                method: { type : 'text' },
                                                group: { type : 'integer' },
                                            }},
                                    }
                                },
                                reviewsScore: { type: 'nested', 
                                    properties: {
                                        selector: { type: 'text' },
                                        property: { type: 'text' },
                                        regex: { type: 'nested', 
                                            properties: {
                                                regex: { type : 'text' },
                                                method: { type : 'text' },
                                                group: { type : 'integer' },
                                            }},
                                    }
                                },
                                reviewsNumber: { type: 'nested', 
                                    properties: {
                                        selector: { type: 'text' },
                                        property: { type: 'text' },
                                        regex: { type: 'nested', 
                                            properties: {
                                                regex: { type : 'text' },
                                                method: { type : 'text' },
                                                group: { type : 'integer' },
                                            }},
                                    }
                                },
                            }
                        },

                        cookies:    { type: 'nested', 
                            properties: {
                                name:       { type: 'text' },
                                value:      { type: 'text' },
                                domain:    { type: 'text' },
                            }
                        },

                        pptrSnippet: { type: 'text' },
                    }
                }
            }
        })
    }
}

const initializeWorkspacesIndex = async() => {
    const check = await checkIndex('workspaces');

    if(!check){
        await elasticClient.indices.create({
            index: 'workspaces',
            body: {
                mappings: {
                    dynamic: 'false',
                    properties: {
    
                        name: { 
                            type: 'text' 
                        },

                        frequency: { 
                            type: 'text' 
                        },

                        type: {
                            type: 'text'
                        },

                        startDate: { 
                            type: 'date', 
                        },
                        
                        nextCrawl: { 
                            type: 'date',
                        },

                        status: {
                            type: 'text'
                        },

                        productsScope: { 
                            type: 'text' 
                        },

                        websitesScope: { 
                            type: 'text' 
                        },
                                
                    }                    
                }
            }
        })
    }
}

const initializeProductsIndex = async() => {
    const check = await checkIndex('products');
    if(!check){
        await elasticClient.indices.create({
            index: 'products',
            body: {
                mappings: {
                    dynamic: 'false',
                    properties: {
                        code: { 
                            type: 'keyword' 
                        },
                        matches: {
                            dynamic: 'strict',
                            type: 'nested',
                            properties: {
                                url: { 
                                    type: 'keyword' 
                                },
                                hostname: { 
                                    type: 'keyword' 
                                },
                                matching: { 
                                    type: 'text' 
                                },
                                status: { 
                                    type: 'text' 
                                },
                            }
                        }
                    }
                }
            }
        })
    }
}

const setup = async() => {
    await initializeRetailersIndex();
    await initializeWorkspacesIndex();
    await initializeProductsIndex();
}


module.exports = {
    elasticClient,
    setup,
}