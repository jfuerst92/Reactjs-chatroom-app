FROM node:carbon

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN npm config set proxy http://30709:wed@proxy-west.aero.org:8080
RUN npm config set https-proxy http://30709:wed@proxy-west.aero.org:8080

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

COPY . .

EXPOSE 8080

CMD [ "npm", "start" ]
