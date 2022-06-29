const jwt = require("express-jwt"); 
const jwksRsa = require("jwks-rsa");

const authConfig = {
    domain: process.env.AUTH0_DOMAIN,
    audience: process.env.AUTH0_AUDIENCE,
}

const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        // jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`
        jwksUri: 'https://harvestore.eu.auth0.com/.well-known/jwks.json'
    }),
  
    // audience: authConfig.audience,
    audience: 'https://harvestore-v5-api',

    // issuer: `https://${authConfig.domain}/`,
    issuer: 'https://harvestore.eu.auth0.com/',
    algorithms: ["RS256"]
});

module.exports = {
    checkJwt: checkJwt,
}