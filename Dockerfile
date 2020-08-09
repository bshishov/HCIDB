FROM node:8-jessie-slim
RUN npm install -g http-server

WORKDIR /app

COPY . .

RUN npm install --progress=false && \
    npm rebuild node-sass &&\
    npm run build

EXPOSE 8080
CMD [ "http-server", "dist" ]
