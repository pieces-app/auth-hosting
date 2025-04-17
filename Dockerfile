# — Build Stage — 
FROM node:alpine3.20 AS build

# 1) Declare the build‑args we’ll pass in (via Cloud Build).
ARG SENTRY_AUTH_TOKEN
ARG COMMIT_SHA

# 2) Export them into the container’s ENV so sentry‑cli sees them.
ENV SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN}
ENV COMMIT_SHA=${COMMIT_SHA}

WORKDIR /app

# 3) Install deps and build your React app
COPY ["package.json", "yarn.lock*", "./"]
RUN yarn install

COPY . .
RUN yarn build

# 4) Install sentry‑cli and create/finalize a release
#    (replace `your-project-slug` with the slug from your Sentry org)
RUN yarn global add @sentry/cli \
 && sentry-cli releases new -p your-project-slug $COMMIT_SHA \
 && sentry-cli releases set-commits --auto $COMMIT_SHA \
 && sentry-cli releases finalize $COMMIT_SHA


# — Production Stage — 
FROM nginx:stable-alpine AS production
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]