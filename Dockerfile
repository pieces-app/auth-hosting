# — Build Stage — 
FROM node:alpine3.20 AS build

ARG SENTRY_AUTH_TOKEN
ARG COMMIT_SHA
ARG SENTRY_ORG
ARG SENTRY_PROJECT

ENV SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN}
ENV COMMIT_SHA=${COMMIT_SHA}
ENV SENTRY_ORG=${SENTRY_ORG}
ENV SENTRY_PROJECT=${SENTRY_PROJECT}

WORKDIR /app
COPY ["package.json", "yarn.lock*", "./"]
RUN yarn install
COPY . .
RUN yarn build

# — Production Stage — 
FROM nginx:stable-alpine AS production
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
