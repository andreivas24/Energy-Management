# Using node:16-alpine base image
FROM node:16-alpine
 
# Set /app as the default work directory
WORKDIR /app
 
# Install Yarn using apk
RUN apk add --no-cache yarn
 
# Copy package.json and yarn.lock to the working directory for packages installation
COPY package.json yarn.lock ./
 
# Install project dependencies using Yarn
RUN yarn install
 
# Copy all the project files to the working directory
COPY . .
 
# Expose the port of your application to bind with the host port
EXPOSE 3000
 
# Run your app
CMD ["yarn", "run", "start"]
