# Stage 1: build the Next.js app
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies first to use Docker cache efficiently
COPY package.json package-lock.json* ./
COPY pnpm-lock.yaml* ./
COPY yarn.lock* ./
RUN npm install

# Copy the rest of the source code
COPY . ./

# Build the app for production
RUN npm run build

# Stage 2: production image
FROM node:20-alpine AS runner
WORKDIR /app

# Copy only production dependencies and build output
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/next-env.d.ts ./next-env.d.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/app ./app

ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "start"]
