# Use Node.js 20 Alpine for a lightweight base image
FROM node:20-alpine AS base
LABEL org.opencontainers.image.source="https://github.com/Risan3232/CSE3-CWA"
WORKDIR /app

# Builder stage: Install dependencies and build the app
FROM base AS builder
COPY package.json package-lock.json* ./
# Install all deps (including devDeps) so the build can run
RUN npm ci --only=production=false

# Copy Prisma schema early so generation can use it
COPY prisma ./prisma

# Set DATABASE_URL for build time (SQLite)
ENV DATABASE_URL="file:./prisma/dev.db"

# Generate Prisma Client and populate local SQLite (if applicable)
RUN npx prisma generate
RUN npx prisma db push

# Copy the rest of the application and build
COPY . .
RUN npm run build

# Remove devDependencies to keep the final image small
RUN npm prune --production

# Runner stage: Create a production-ready image
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000

# Create a non-root user for security
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

# Copy only what's needed for runtime, ensuring correct ownership
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# Switch to non-root user
USER nextjs

# Expose port 3000 and provide a lightweight healthcheck using Node (no curl needed)
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
	CMD node -e "require('http').get('http://localhost:3000', r => { if (r.statusCode>=200 && r.statusCode<400) process.exit(0); else process.exit(1); }).on('error', ()=>process.exit(1))"

# Start the app
CMD ["npm", "start"]
