FROM node:21
WORKDIR /home/node/app
COPY package*.json ./
COPY start.js ./
EXPOSE 80
RUN ["npm", "install"]
ENTRYPOINT [ "npm", "start", "--", "--port", "80" ]