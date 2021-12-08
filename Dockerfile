FROM node
WORKDIR /app
COPY . .
RUN npm install --verbose --force && npx browserslist@latest --update-db
ENV NODE_OPTIONS=--openssl-legacy-provider
EXPOSE 3000
ENTRYPOINT ["npm", "start"]
