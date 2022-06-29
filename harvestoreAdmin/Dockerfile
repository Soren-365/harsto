FROM node:18-alpine3.15


ARG VITE_API_HOST
ENV VITE_API_HOST "api"

# install dependencies
WORKDIR /app
COPY package.json package-lock.json ./

# Copy all local files into the image.
COPY . .
RUN npm install

RUN npm run build

# ###
# # Only copy over the Node pieces we need
# # ~> Saves 35MB
# ###
# FROM node:18-slim

# WORKDIR /app
# COPY --from=0 /app .
# COPY . .

EXPOSE 3000
CMD ["node", "build/index.js"]