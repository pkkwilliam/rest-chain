#docker build -t chain_request:0.0.1 .
#docker run chain_request

FROM node:alpine
RUN mkdir /app
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
CMD ["npm", "start"]