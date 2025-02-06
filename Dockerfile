# Build Stage
FROM node:alpine3.20 AS build
WORKDIR /app
COPY ["package.json", "yarn.lock*", "./"]
RUN yarn install
COPY . .
RUN yarn build
 
# Production Stage
FROM nginx:stable-alpine AS production
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]