FROM node:20.11.0
WORKDIR /app
RUN ls
COPY package*.json ./
RUN npm i
COPY ./ ./
EXPOSE 5173
CMD ["npm", "run", "dev"]