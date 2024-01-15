FROM --platform=linux/amd64 node:20-bullseye

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Bundle app source
COPY . /usr/src/app

RUN npm ci
RUN npm run build
RUN npm prune --production

ENV NODE_ENV=production
ENV NODE_PORT=8080

CMD [ "node", "dist/main" ]