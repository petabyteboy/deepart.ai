# deepart.ai Frontend

This repository contains the frontend for deepart.ai. It is used to present the project, display rendered images and collect input from the user.

## Development

You will need current versions of NodeJS, [the yarn package manager](https://yarnpkg.com/) and NGINX. Use the NGINX configuration provided and change the URL to the backend. 
* Run `yarn` to install the dependencies required for the build process
* Run `node_modules/.bin/gulp` to build the project
* Run `node_modules/.bin/gulp watch` to let gulp watch for changes in the project and automatically rebuild
* The output will be located in the `dist` directory

* Make sure your NGINX version is greater than 1.13.9! *
