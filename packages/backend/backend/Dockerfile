# packages/backend/Dockerfile

# Use an official Node.js image as a base
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and install dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# Copy the rest of the app files
COPY . .

# Expose the NestJS port
EXPOSE 3001

# Start the NestJS server
CMD ["npm", "run", "start:prod"]
