# 1. Install dependencies (only production)
FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# 2. Build the app with Sharp support
FROM node:20-alpine AS builder
WORKDIR /app

# Install native libs for Sharp + Firebase Admin during build
RUN apk add --no-cache vips-dev fftw-dev build-base python3

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 3. Final production image (slimmed down)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Optional, in case Firebase Admin needs shared libs
RUN apk add --no-cache libc6-compat

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=deps /app/node_modules ./node_modules

EXPOSE 3000
CMD ["npm", "start"]