const { elasticClient } = require("../config/elastic.config");
const { logger } = require('../utils/logger');

const csvImport = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update cannot be empty!",
    });
  }

  const products = req.body;

  try {
    for (product of products) {
      let hostname = new URL(product.url);
      hostname = hostname.hostname.replace("www.", "");

      const temp = {
        code: product.code,
        matches: [
          {
            url: product.url,
            matching: "bulk_csv",
            status: "confirmed",
            hostname: hostname,
          },
        ],
      };

      let data = await elasticClient.search({
        index: "products",
        body: {
          query: {
            term: {
              code: temp.code,
            },
          },
        },
      });

      if (data.hits.hits.length > 0) {
        if (
          data.hits.hits[0]._source.matches.some(
            match => match.url === temp.matches[0].url
          )
        ) {
          console.log("Offer already exists");
        } else {
          data.hits.hits[0]._source.matches.push(temp.matches[0]);
          await elasticClient.update({
            index: "products",
            id: data.body.hits.hits[0]._id,
            refresh: true,
            body: {
              doc: {
                matches: data.hits.hits[0]._source.matches,
              },
            },
          });
        }
      } else {
        await elasticClient.index({
          index: "products",
          refresh: true,
          body: temp,
        });
      }
    }

    res.status(200).send({
      message: "CSV successfully imported",
    });

  } catch (error) {
    logger.error(
      `[PRODUCTS > csvImport] - Error occured while importing products`
    );
    res.status(500).send({
      message: error.message || `Error occured while importing products`,
    });
  }
};

const createProduct = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Req.body is empty.",
    });
  }

  try {
    await elasticClient.index({
      index: "products",
      refresh: true,
      body: req.body,
    });

    res.status(200).send({
      message: "Product saved.",
    });
  } catch (error) {
    logger.error(
      `[PRODUCTS > createProduct] - Error occured while creating new product : ${product}`
    );
    res.status(500).send({
      message:
        error.message ||
        `Error occured while creating new product : ${product}`,
    });
  }
};

const readProductByCode = async (req, res) => {
  if (!req.params.code) {
    return res.status(400).send({
      message: "req.params.code is empty.",
    });
  }

  console.log('req.params.code : ', req.params.code);

  try {
    const product = await elasticClient.search({
      index: "products",
      body: {
        query: {
          term: {
            code: req.params.code,
          },
        },
      },
    });

    console.log('product : ', product);

    res.status(200).send(product);
  } catch (error) {
    logger.error(
      `[PRODUCTS > readProductByCode] - Error occured while retrieving product with id : ${code}`
    );
    res.status(500).send({
      message:
        error.message ||
        `Error occured while retrieving product with id : ${code}`,
    });
  }
};

const readProducts = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update cannot be empty!",
    });
  }

  try {
    const data = await elasticClient.search({
      index: "products",
      from: 0,
      size: 1000,
      body: {
        query: {
          match_all: {},
        },
      },
    });

    res.status(200).send(data);
  } catch (error) {
    logger.error(
      `[PRODUCTS > readProducts] - Error occured while updating Product with id : ${req.params.code}`
    );
    res.status(500).send({
      message:
        error.message ||
        `Error occured while updating Product with id : ${req.params.code}`,
    });
  }
};

const updateProduct = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update cannot be empty!",
    });
  }

  try {
    await elasticClient.update({
      index: "products",
      id: req.params.id,
      refresh: true,
      body: {
        doc: req.body,
      },
    });

    res.status(200).send({
      message: "Product successfully updated.",
    });
  } catch (error) {
    logger.error(
      `[PRODUCTS > updateProduct] - Error occured while updating Product with id : ${req.params.code}`
    );
    res.status(500).send({
      message:
        error.message ||
        `Error occured while updating Product with id : ${req.params.code}`,
    });
  }
};

module.exports = {
  csvImport,
  createProduct,
  readProductByCode,
  readProducts,
  updateProduct,
};
