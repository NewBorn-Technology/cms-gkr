FROM node:20.15.1-bullseye

RUN apt-get update && apt-get install -y \
    libc6-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . .

RUN npm install sharp \
    && npm install \
    && npm run build

EXPOSE 3001

ENV PORT 3001
ENV HOST 0.0.0.0

CMD npm run start