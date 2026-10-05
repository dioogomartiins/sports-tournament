FROM node:20-alpine

WORKDIR /app

# Install dependencies first for better Docker layer caching
COPY package.json package-lock.json ./
RUN npm ci

# Copy application source files
COPY . .

# Expose Vite dev server default port
EXPOSE 5173

# Run Vite with 0.0.0.0 host binding so it is accessible outside the container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
