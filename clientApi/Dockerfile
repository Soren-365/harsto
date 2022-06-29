#A lightweight node image
FROM node:18-alpine3.16 
#PM2 will be used as PID 1 process
# RUN npm install -g pm2

# Copy package json files for services


RUN mkdir -p /usr/src/clientApi/ && chown -R node:node /usr/src/clientApi/

WORKDIR /usr/src/clientApi/
# RUN chmod -R 777 ./
# RUN npm install -g pm2
# RUN chmod -R 755 ./

USER node

COPY --chown=node:node ./package*.json ./




RUN npm install 

# If you are building your code for production
# RUN npm ci --only=production


COPY . .


ENV NODE_ENV=production
ENV PORT=7777

#CMD ["pm2-runtime", "ecosystem.config.cjs"]
#CMD ["pm2-runtime", "index.js"]
ENTRYPOINT  ["npm", "run", "start"]
