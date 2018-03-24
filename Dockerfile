FROM node:latest
RUN mkdir /app
WORKDIR /app
ADD . /app
RUN npm i -g yarn
RUN yarn
RUN ./node_modules/.bin/gulp
RUN apt-get update -y -qq; apt-get install nginx -y -qq
RUN cp nginx.conf.dev.example /etc/nginx/nginx.conf
RUN cp -r dist/ /usr/share/nginx/;
CMD ["nginx", "-g", "daemon off;"]
