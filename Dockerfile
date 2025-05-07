FROM node:18-alpine

# Install dependencies for sharp
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files first for better caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the app
COPY . .

# Build the application
RUN npm run build

# Expose the port the app will run on
EXPOSE 3000

# Set environment variables
ENV PORT 3000
ENV HOST 0.0.0.0
ENV NODE_ENV production

# Start the application
CMD ["npm", "start"]