# Multi-stage build for production
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .
RUN npm run build

# Expose port
EXPOSE 80
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]