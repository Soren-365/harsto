import { environment } from "./environment.js";
import express from "express";
import { dateFormat } from "./lib/dateformat.js";
import bodyParser from "body-parser";
import {setup as ElasticSetup, elasticClient } from './config/elastic.config.js'
import  { logger }  from "./lib/logger.js";
import mountRoutes from './routes/index.js'
import process, { EventEmitter } from 'node:events';

 EventEmitter.defaultMaxListeners = 5000

// //defaultMaxListeners = 100;
// //EventEmitter.prototype._maxListeners = 100;

const elasticInitialization = async() => {
  try {
      await elasticClient.ping();
      console.log('[ELASTICSEARCH]: 🟢 Successfully connected.');
      await ElasticSetup();
      console.log('[ELASTICSEARCH]: 🟢 Successfully setup.');
  } catch (error) {
      console.log(error);
      logger.error('[ELASTICSEARCH]: Error connecting to Elasticsearch...', error);
  }
}

elasticInitialization();


const server = express();

const allowCorsOrgin = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
};

server.use(allowCorsOrgin);

let printBodies = function (req, res, next) {
  console.log("   ----  ");
  console.log("Time:", dateFormat(new Date(), "%Y-%m-%d %H:%M:%S", true));
  console.log("Request URL:", req.originalUrl);
  console.log("Request Type:", req.method);
  console.log("Post body:", req.body);
  next();
};

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(printBodies);

mountRoutes(server)

server.get("/", async (request, response) => {
  response.send("server online");
});

server.get("/api/getreadystatus", function (req, res) {
  console.log("sending server ready status to client ");
  res.send("server online");
  
}); 


//server.get("/api/getworkspaces", async (request, response) => {
//   const workspaces_raw = await elasticApi.get("workspaces/read");
//   //  console.log("workspaces_raw", workspaces_raw.data)
//   const workspaces = workspaces_raw.data.hits.hits;
//   //console.log("workspaces: ", workspaces)

//   console.log(
//     "workspaces._source",
//     workspaces.map((workspace) => workspace._source)
//   );

//   const responseObject = {
//     workspaces: workspaces.map((workspace) => {
//       return {
//         id: workspace._id,
//         title: workspace._source.name,
//         productscount: workspace._source.productsScope.length,
//       };
//     }),
//   };

//   response.status(200).send({ data: responseObject });
// });





server.listen(environment.port || 3000, () => {
  console.log(`Server UP! @ port ${environment.port}`);
});
