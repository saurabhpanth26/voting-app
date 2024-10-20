# Base image
FROM node:14

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the app files
COPY . .

# Expose the service port
EXPOSE 3001 

# Command to run the app
CMD ["node", "create_topic.js"]  
