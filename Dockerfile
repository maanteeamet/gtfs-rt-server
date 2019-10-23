FROM node:8

# Create app directory
WORKDIR /usr/src/app

RUN apt-get update

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

ARG MQTTCLIENTPASS='sHalLnoTpaSS'

#overrun when running docker package (-e)
ENV \
    MQTTCLIENTURL='mqtt://localhost:1883'\
    MQTTCLIENTUSER='publisher'\
    MQTTCLIENTPASS=${MQTTCLIENTPASS}

# Bundle app source
COPY . .

CMD npm start -- $MQTTCLIENTURL $MQTTCLIENTUSER $MQTTCLIENTPASS