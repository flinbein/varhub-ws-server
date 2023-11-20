FROM node:21
#RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY /node_modules ./node_modules
COPY package*.json ./
COPY start.js ./
EXPOSE 80
ENTRYPOINT [ "node", "./start.js", "--port", "80" ]