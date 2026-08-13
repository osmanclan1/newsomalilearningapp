# ---- Phase 2: Build Stage ----
# Postcondition (2.4): dist/ produced — index.html + hashed assets/*, zero build errors
FROM node:22-alpine AS build
WORKDIR /app

# Step 2.2 — manifest copied, dependencies installed
COPY package.json package-lock.json ./
RUN npm ci

# Step 2.3 — source tree copied
COPY . .

# Step 2.4 — vite build executes
RUN npm run build

# ---- Phase 3: Image Assembly ----
# Postcondition: final image holds only dist/ + routing config, nothing from the build stage
FROM nginx:alpine AS serve

# Step 3.3 — routing/caching config applied (SPA fallback)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Step 3.2 — artifact copied across the stage boundary, only dist/
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
