FROM node:20.11.0
WORKDIR /app
RUN ls
COPY package*.json ./
RUN npm i
RUN chmod +x /app/node_modules/.bin/nodemon
COPY ./ ./
RUN npx prisma generate
RUN npm run seed
CMD ["npm", "run", "dev"]
