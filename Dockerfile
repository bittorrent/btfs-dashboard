FROM node AS build
WORKDIR /app
COPY . .
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN yarn install && yarn build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html