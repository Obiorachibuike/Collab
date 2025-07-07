# Use official Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy dependencies first (for better caching)
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy rest of the app
COPY . .

# Set environment (can be overridden by docker-compose or cloud platform)
ENV NODE_ENV=production
ENV PORT=5000

# Expose the app port
EXPOSE 5000

# Start the application
CMD ["node", "index.js"]