const rabbitConfig = {
    host: `amqp://${process.env.RABBIT_USERNAME}:${process.env.RABBIT_PASSWORD}@${process.env.RABBIT_HOST}:${process.env.RABBIT_PORT}`,
    api: `http://${process.env.RABBIT_USERNAME}:${process.env.RABBIT_PASSWORD}@${process.env.RABBIT_HOST}:${process.env.RABBIT_PORT_API}`,
    prefetch: process.env.RABBIT_PREFETCH,
    username: `${process.env.RABBIT_USERNAME}`,
    password: `${process.env.RABBIT_PASSWORD}`,
    authorization: `${process.env.RABBIT_AUTHORIZATION}`,
}

module.exports = rabbitConfig;