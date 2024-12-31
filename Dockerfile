FROM node:20 AS base
LABEL Name = Amit Maurya
WORKDIR /app
COPY package* /app/
RUN npm install
COPY . .
EXPOSE 3000

FROM node:20-alpine3.21
WORKDIR /app
COPY --from=base /app /app
CMD ["npm","start"]

