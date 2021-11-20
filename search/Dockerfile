FROM node:latest
WORKDIR /usr/src/search
COPY "package*.json" ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]