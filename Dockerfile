# Dockerfile
FROM node:20-bullseye

# Set working directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Generate Prisma client di dalam container (❗ penting agar sesuai arsitektur Linux)
# RUN npx prisma generate

# Build Next.js
# RUN npm run build

# Expose port
EXPOSE 3000

# Start app
# Generate Prisma client saat container start
CMD npx prisma generate && npm run build && npm start
