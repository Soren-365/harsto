import Router from "express-promise-router";
import pgdb from "../config/supabase_direct_pg.js";
import { elasticClient } from "../config/elastic.config.js";
import elasticApi from "../config/http-elastic.js";
import { logger } from "../lib/logger.js";
import moment from "moment";
import util from "util";
import { kill } from "process";

//import { getKpis } from '../lib/kpis.controller.js';
// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router();
// export our router to be mounted by the parent application

router.get("/:token/workspace/:workspaceId", async (req, res) => {
  console.log("getting workspace...");
  const { workspaceId, token } = req.params;

  //Read Workspace

  const query1 = `SELECT id FROM client_user WHERE apikey=$1;`;
  const values1 = [token];
 
  const response1 = await pgdb.query(query1, values1, res, "Incorrect Api token");

  const query2 = `SELECT elastic_id FROM workspace WHERE client_user_id=$1;`;
  const values2 = [response1.rows[0].id];

  const response2 = await pgdb.query(query2, values2);

  const workspaceIds = response2.rows.map((row) => {
    return row.elastic_id;
  });
  console.log("workspaceIds", workspaceIds);
  // const response = await getKpis(workspaceIds[0])
  // console.log("response", response )
  const auth = workspaceIds.find(
    (workspaceIdForUser) => workspaceId === workspaceIdForUser
  );

  if (!auth) {
    return res.status(500).send({
      data: "You do not have access to this workspace, or the workspace does not exist. Check your workspace access on endpoint: /api/[your-token-here]/getWorkspaces ",
    });
  } else {
    let crawlDate = moment().format("YYYY-MM-DD");
    if (req.query.date) {
      crawlDate = moment(req.query.date).format("YYYY-MM-DD");
    }

    let crawlIndex;
    let isIndex = false;
    let i = 0;
    while (!isIndex) {
      console.log("isIndex", isIndex);
      crawlIndex = `offer-crawling_raw_${moment()
        .subtract(i, "days")
        .format("YYYY-MM-DD")}`;
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
    console.log("this is the crawlIndex to be used:", crawlIndex);
    console.log("this is the workspaceId ", workspaceId);

    let workspace;
    try {
      workspace = await elasticApi.get(`workspace/read/${workspaceId}`);
    } catch (error) {
      console.log(error);
    }

    console.log("workspace_raw", workspace.data);

    const productsScope = workspace.data._source.productsScope.map(
      (productScope) => productScope.replace("\n", "")
    );
    const websitesScope = workspace.data._source.websitesScope.map(
      (workspaceScope) => workspaceScope.replace("\n", "")
    );
    console.log("productsScope", productsScope, websitesScope);

    console.log("websitesScope", websitesScope, typeof websitesScope);

    let error = false;
    let dataSendObject;
    if (isIndex) {
     
      let promises = [];
      let promisesIndexData = [];
      productsScope.forEach(async (productCode) => {
        let urlsArray = [];
        websitesScope.forEach(async (websiteUrl) => {
          try {
            // console.log("websiteUrl", websiteUrl);
            // console.log("productCode", productCode);

            let promise = new Promise((resolve, reject) =>
              resolve(
                elasticClient.search({
                  index: crawlIndex,

                  query: {
                    bool: {
                      must: [
                        {
                          match: {
                            offer_code_keyword: productCode,
                          },
                        },
                        {
                          match: {
                            offer_domain_keyword: websiteUrl,
                          },
                        },
                      ],
                    },
                  },
                })
              )
            );
            promises.push(promise);
            promisesIndexData.push({
              websiteUrl: websiteUrl,
              productCode: productCode,
            });
          } catch (error) {
            logger.error(
              `[ELASTICSEARCH] Error: could not retrieve data for workspace ${workspaceId} at ${crawlDate}`,
              error
            );
            error = true;
          }
        });
      });
          //   console.log("promises:", promises)
          const searchResults = await Promise.all(promises);
          // console.log("searchResults", searchResults)
          const offersWithUndefined = searchResults.map((searchResult) => {
            // console.log("searchResult", searchResult);
            if (searchResult && searchResult.hits.hits.length > 0) {
              //console.log("got ddata!", data);
              const offer = searchResult.hits.hits[0]._source;
              return offer;
            } else {
              console.log(`no data for ${searchResult} at ${crawlDate}`);
            }
          });

          // console.log("offersWithUndefined", offersWithUndefined.length)
          // console.log("promisesIndexData", promisesIndexData.length)
          // console.log("offers length", offersCleaned)
          // console.log("promiseIndexData length", promisesIndexDataCleaned)

          const promisesIndexDataCleaned = promisesIndexData
            .map((promiseIndexData, index) => {
              //  console.log("offersWithUndefined[index]",offersWithUndefined[index])
              if (offersWithUndefined[index] === undefined) {
                return undefined;
              } else {
                return promiseIndexData;
              }
            })
            .filter((indexData) => indexData != undefined);
          console.log("promisesIndexDataCleaned", promisesIndexDataCleaned);

          const offersCleaned = offersWithUndefined.filter(
            (offer) => offer != undefined
          );

          console.log("offers length", offersCleaned.length);
          console.log(
            "promiseIndexData length",
            promisesIndexDataCleaned.length
          );

          let thisUrl;
          let lastProductCode;
          let productData = { code: "", urls: [] };

          let urlsArray = [];
          let products = [];

          promisesIndexDataCleaned.forEach((entry, index) => {
            //console.log("entry", entry, productData);
            const urlsEntry = {
              url: offersCleaned[index].offer_link_keyword,
              price: offersCleaned[index].offer_priceCurrent,
              inStock: offersCleaned[index].offer_availability,
              reseller: entry.websiteUrl,
            };

            urlsArray.push(urlsEntry);

            if (lastProductCode !== entry.productCode) {
              //console.log("productData", productData)

              productData = {
                code: entry.productCode,
                urls: urlsArray,
              };
              products.push(productData);
              urlsArray = [];
            }
            lastProductCode = entry.productCode;
          });

          console.log("products", products);
          dataSendObject = {
            workspace: {
              title: workspace.data._source.name,
              productsCount: productsScope.length,
              products: products,
            },
          };

          console.log(
            util.inspect(dataSendObject, {
              showHidden: false,
              depth: null,
              colors: true,
            })
          );

        
   
      if (!error) {
        return res.status(200).send({ data: dataSendObject });
      } else {
       return  res.status(500).send({
          message: `[ELASTICSEARCH] Error: could not retrieve data for workspace ${workspaceId} at ${crawlDate}`,
        });
      }
    }
  }
});

export default router;
