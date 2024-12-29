FROM node:20-alpine3.18

RUN mkdir /kp-web
WORKDIR /kp-web
COPY . /kp-web
ENV PATH /kp-web/node_modules/.bin:$PATH

RUN npm install --silent

USER root
RUN npm install -g serve --save
RUN npm run build
CMD ["npm", "run", "deploy"]