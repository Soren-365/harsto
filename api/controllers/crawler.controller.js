const amqp = require("amqplib/callback_api");
const Rabbitmq = require("../config/rabbitmq.config");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const { readRetailerByUrl } = require("./retailers.controller");
const { elasticClient } = require('../config/elastic.config')
const axios = require("axios-https-proxy-fix");
const { logger } = require('../utils/logger');
const Offers = require("./offers.controller");
const moment = require("moment");

//////////////// PPTR Methods ////////////////
const getBrowser = async () => {
  const args = [
    "ignoreHTTPSErrors",
    `--proxy-server=${process.env.PROXY_MANAGER_HOST}:${process.env.PROXY_MANAGER_PORT}`,
  ];

  puppeteer.use(StealthPlugin());

  return await puppeteer.connect({
    browserWSEndpoint:
      `ws://${process.env.BROWSERLESS_HOST}:${process.env.BROWSERLESS_PORT}?` +
      args.join("&"),
  });
};

const getBody = async (url, retailerConfig) => {
  let results = {
    data: "",
    status: "",
  };

  const debug = false;

  try {
    let browser;
    if (debug) {
      browser = await puppeteer.launch({
        headless: false,
        // slowMo: 250,
      });
    } else {
      browser = await getBrowser();
    }
    const page = await browser.newPage();
    await page.setRequestInterception(true);

    // disabling unrequired resources loading
    page.on("request", (request) => {
      if (
        request.resourceType() == "stylesheet" ||
        request.resourceType() == "font" ||
        request.resourceType() == "image"
      ) {
        request.abort();
      } else {
        request.continue();
      }
    });

    //authenticating to Proxy Manager
    await page.authenticate({
      username: process.env.PROXY_MANAGER_USERNAME,
      password: process.env.PROXY_MANAGER_PASSWORD,
    });

    // timeout lengthening
    await page.setDefaultNavigationTimeout(60000);

    //cookies loading
    if (retailerConfig.cookies[0].name != "") {
      await page.setCookie(...retailerConfig.cookies);
    }

    //go to url
    const response = await page.goto(url, { waituntil: "networkidle2" });

    //get page body html
    const body = await page.content();

    //closing and disconnecting
    await page.close();
    await browser.disconnect();

    results.data = body;
    results.status = response._status;
  } catch (error) {
    logger.error(
      `[PPTR - crawler.controller.js > getBody]: Error occurred in the crawling process using PPTR... url : ${url}`,
      error
    );
    results.status = 404;
  }

  return results;
};

//Checking if HTML Body well received, or managing 4** status code.
const scrapingWithPuppeteer = async (channel, msg, retailerConfig) => {
  let results;

  try {
    const url = JSON.parse(msg.content.toString())["url"];
    results = await getBody(url, retailerConfig);
    if (results.status === 200) {
      await channel.ack(msg);
    } else {
      const regex = new RegExp(/4\d{2}/, "gm");
      if (regex.exec(results.status)) {
        logger.info(
          `[PPTR] - crawler.controller.js > scrapingWithPuppeteer]: Error status while trying to load url : ${url}`
        );
        await channel.ack(msg);
      } else {
        logger.error(
          `[PPTR] - crawler.controller.js > scrapingWithPuppeteer]: Error occurred in the crawling process... --> retrying url : ${url}`
        );
        await channel.nack(msg);
      }
    }
  } catch (error) {
    logger.error(
      `[PPTR - crawler.controller.js > scrapingWithPuppeteer]: Error occurred in the crawling process using PPTR... url : ${url}`,
      error
    );
  }

  return results;
};

//Complete PPTR Crawling Process
const puppeteerCrawlingProcess = async (channel, msg, retailerConfig, url) => {
  let results;
  try {
    results = await scrapingWithPuppeteer(channel, msg, retailerConfig);
    if (results.status === 200) {
      results = await Offers.parseOffer(results.data, retailerConfig, url);
      results.offer.statusCode = "200";
      results = Offers.cleanPrice(results);
      results = Offers.trimOffer(results);
      results = Offers.parseAvailability(results);
      results = Offers.parseDiscount(results);
      results = await Offers.getCode(results);
    } else {
      results = new Offers.Offer();
      results.offer.isOffer = false;
      results.offer.statusCode = "404";
      results.offer.lastCrawl = moment().format();
      results.offer.link = new URL(url);
      results.offer.domain = results.offer.link.hostname.replace("www.", "");
      results = await Offers.getCode(results);
    }
  } catch (error) {
    logger.error(
      `[PPTR - crawler.controller.js > scrapingWithPuppeteer]: Error occurred in the crawling process using PPTR... url : ${url}`,
      error
    );
  }

  return results;
};

//////////////// HTTP Methods ////////////////

//Fetch HTML Body using HTTP Request
const getBodyWithHttpRequest = async (url, retailerConfig) => {
  let response;

  try {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
    response = await axios.get(url, {
      proxy: {
        host: process.env.PROXY_MANAGER_HOST,
        port: process.env.PROXY_MANAGER_PORT,
        auth: {
          username: process.env.PROXY_MANAGER_USERNAME,
          password: process.env.PROXY_MANAGER_PASSWORD,
        },
      },
    });
  } catch (error) {
    logger.error(
      `[HTTP Request - crawler.controller.js > getBodyWithHttpRequest]: Error occurred in the crawling process using HTTP Request... url : ${url}`,
      error
    );
    response = {
      data: "",
      status: 404,
    };
  }

  return response;
};

//Checking if HTML Body well received, or managing 4** status code.
const scrapingWithHttpRequest = async (channel, msg, retailerConfig) => {
  let results;

  try {
    const url = JSON.parse(msg.content.toString())["url"];
    results = await getBodyWithHttpRequest(url, retailerConfig);

    const regex400 = new RegExp(/4\d{2}/, "gm");
    const regex200 = new RegExp(/2\d{2}/, "gm");
    const regex300 = new RegExp(/3\d{2}/, "gm");

    if (
      regex200.exec(results.status) ||
      regex400.exec(results.status) ||
      regex300.exec(results.status)
    ) {
      await channel.ack(msg);
    } else {
      logger.error(
        `[HTTP Request] - crawler.controller.js > scrapingWithHttpRequest]: Error status while trying to load url : ${url}`
      );
      await channel.nack(msg);
    }
  } catch (error) {
    logger.error(
      `[HTTP Request - crawler.controller.js > scrapingWithHttpRequest]: Error occurred in the crawling process using HTTP Request... url : ${url}`,
      error
    );
  }

  return results;
};

//Complete HTTP Request Crawling Process
const httpRequestCrawlingProcess = async (
  channel,
  msg,
  retailerConfig,
  url
) => {
  let results;
  try {
    results = await scrapingWithHttpRequest(channel, msg, retailerConfig);
    if (results.status === 200) {
      results = await Offers.parseOffer(results.data, retailerConfig, url);
      results = Offers.cleanPrice(results);
      results.offer.statusCode = "200";
      results = Offers.trimOffer(results);
      results = Offers.parseAvailability(results);
      results = Offers.parseDiscount(results);
      results = await Offers.getCode(results);
    } else {
      results = new Offers.Offer();
      results.offer.isOffer = false;
      results.offer.statusCode = "404";
      results.offer.lastCrawl = moment().format();
      results.offer.link = new URL(url);
      results.offer.domain = results.offer.link.hostname.replace("www.", "");
      results = await Offers.getCode(results);
    }
  } catch (error) {
    logger.error(
      `[HTTP Request - crawler.controller.js > httpRequestCrawlingProcess]: Error occurred in the crawling process using HTTP Request... url : ${url}`,
      error
    );
  }

  return results;
};

//MAIN PROCESS OF CRAWLING: PPTR AND HTTP
const publishMsgToQueue = async (job, res) => {
  if (!job) {
    console.log("Error occured: job cannot be empty...");
    return;
  }

  if (job.body?.msg) {
    const temp = {
      msg: job.body.msg,
      queueName: job.body.queueName,
    };
    job = temp;
  }

  try {
    amqp.connect(Rabbitmq.host, function (err, connection) {
      if (err || !connection) {
        logger.error("[AMQP] No job to publish");
        return setTimeout(() => {
          publishMsgToQueue(job);
        }, 1000);
      }

      connection.createChannel(function (err, channel) {
        if (closeOnErr(err)) return;

        channel.assertQueue(
          job.queueName,
          {
            durable: true,
          },
          (err, _ok) => {
            if (closeOnErr(err)) return;
          }
        );

        const message = {
          url: job.msg,
        };

        channel.sendToQueue(
          job.queueName,
          Buffer.from(JSON.stringify(message)),
          {
            persistent: true,
          }
        );
        console.log(`${job.msg} successfully published to ${job.queueName}`);

      });
    });
  } catch (err) {
    logger.error(
      "[AMQP] Error publishing to RabbitMQ",
      job.msg,
      "queue name:",
      job.queueName
    );
    closeOnErr(err);
  }
};

function closeOnErr(err) {
  if (!err) return false;
  console.error("[AMQP] error", err);
  logger.error("[AMQP] error", err);
  amqp.close();
  return true;
}

const readCrawlResults = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message:
        "Error occured while trying to retrieve debugger results: req.body is empty",
    });
  }

  try {
    const now = moment().format("YYYY-MM-DD");
    const index = `offer-crawling-raw_${now}`;

    const data = await elasticClient.search({
      index: index,
      body: {
        query: {
          term: {
            "offer.link.keyword": {
              value: req.body.msg,
            },
          },
        },
      },
    });

    console.log("data : ", data);
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send({
      message: error || "Error occured while searching for debugger results...",
    });
  }
};

const consumeQueue = async (queueName) => {



 amqp.connect(Rabbitmq.host, function (error0, connection) {
    if (error0) {
      logger.error("[RABBITMQ]: Error creating connection...", error0);
    }

    connection.createChannel(function (error1, channel) {
      if (error1) {
        logger.error("[RABBITMQ]: Error creating channel...", error1);
      }

      channel.assertQueue(queueName, {
        durable: true,
        auto_delete: true,
      });

      channel.prefetch(parseInt(Rabbitmq.prefetch));

      channel.consume(queueName, async (msg) => {
        const url = JSON.parse(msg.content.toString())["url"];
        const retailerConfig = await readRetailerByUrl(url);
        let results;

        switch (retailerConfig.extraction) {
          case "puppeteer":
            results = await puppeteerCrawlingProcess(
              channel,
              msg,
              retailerConfig,
              url
            );
            await Offers.saveOffer(results);
            break;

          case "request":
            results = await httpRequestCrawlingProcess(
              channel,
              msg,
              retailerConfig,
              url
            );
            await Offers.saveOffer(results);
            break;
        }
      });
    });
  });
};

module.exports = {
  consumeQueue,
  publishMsgToQueue,
  readCrawlResults,
};
