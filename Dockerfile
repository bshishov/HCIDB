FROM node:10
RUN npm install -g http-server@0.12.3

WORKDIR /app

COPY . .

RUN npm install --progress=false && \
    npm rebuild node-sass &&\
    npm run build

EXPOSE 8080
CMD [ "http-server", "dist" ]
