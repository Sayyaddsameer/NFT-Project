# Use Node.js 20 on Alpine Linux for a lightweight, secure image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first to leverage Docker layer caching
COPY package*.json ./

# Install dependencies strictly based on package-lock (if present) or package.json
RUN npm install

# Copy the rest of the source code
COPY . .

# Compile the contracts to check for syntax errors during build time
RUN npx hardhat compile

# Define the default command to run the test suite
CMD ["npx", "hardhat", "test"]