FROM node
COPY . /dApp
WORKDIR /dApp
RUN npm install
EXPOSE 8080
CMD [ "npm", "start" ]
