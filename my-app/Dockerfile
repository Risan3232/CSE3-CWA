# Use Node.js 20 Alpine for a lightweight base image
FROM node:20-alpine AS base
WORKDIR /app

# Builder stage: Install dependencies and build the app
FROM base AS builder
COPY package.json package-lock.json* ./
RUN npm ci --only=production=false  # Install all deps for building
COPY . .
RUN npm run build  # Build the Next.js app

# Runner stage: Create a production-ready image
FROM base AS runner
ENV NODE_ENV=production
# Create a non-root user for security
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

# Copy public folder first (before switching user)
COPY --from=builder /app/public ./public

# Switch to non-root user
USER nextjs

# Copy built files and dependencies with proper ownership
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# Expose port 3000
EXPOSE 3000
# Start the app
CMD ["npm", "start"]
